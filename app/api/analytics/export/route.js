import { NextResponse } from 'next/server';
import { loadAnalyticsData } from '../../../../lib/analytics-storage';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json'; // json, csv, excel, pdf
    const type = searchParams.get('type') || 'all'; // all, overview, detailed
    const period = searchParams.get('period') || 'all';
    
    const data = loadAnalyticsData();
    
    if (!data || (!data.pageViews.length && !data.events.length && !data.clicks.length)) {
      return NextResponse.json({ error: 'No analytics data found' }, { status: 404 });
    }
    
    // Calculate period filter
    const now = Date.now();
    const periodMs = {
      '1d': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      'all': data.metadata.firstDay ? now - data.metadata.firstDay : Infinity
    };
    
    const cutoffTime = period === 'all' && data.metadata.firstDay 
      ? data.metadata.firstDay 
      : now - periodMs[period];
    
    // Filter data by period
    const filteredData = {
      metadata: data.metadata,
      pageViews: data.pageViews.filter(pv => pv.timestamp > cutoffTime),
      events: data.events.filter(ev => ev.timestamp > cutoffTime),
      clicks: data.clicks.filter(click => click.timestamp > cutoffTime),
      sessions: data.sessions,
      exportInfo: {
        exportedAt: new Date().toISOString(),
        period: period,
        totalRecords: 0,
        dateRange: {
          from: new Date(cutoffTime).toISOString(),
          to: new Date().toISOString()
        }
      }
    };
    
    // Add record counts
    filteredData.exportInfo.totalRecords = 
      filteredData.pageViews.length + 
      filteredData.events.length + 
      filteredData.clicks.length;
    
    if (format === 'csv') {
      return exportAsCSV(filteredData, type);
    } else if (format === 'excel') {
      return exportAsExcel(filteredData, type);
    } else if (format === 'pdf') {
      return exportAsPDF(filteredData, type, period);
    } else {
      // Default JSON format
      const filename = `analytics-export-${period}-${new Date().toISOString().split('T')[0]}.json`;
      return new NextResponse(JSON.stringify(filteredData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export analytics data' }, { status: 500 });
  }
}

function exportAsCSV(data, type) {
  let csvContent = '';
  const filename = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`;
  
  if (type === 'overview') {
    // Summary CSV
    csvContent = 'Metric,Value,Period\n';
    csvContent += `Total Visits,${data.pageViews.length},${data.exportInfo.period}\n`;
    csvContent += `Unique Visitors,${new Set(data.pageViews.map(pv => pv.sessionId)).size},${data.exportInfo.period}\n`;
    csvContent += `Total Clicks,${data.clicks.length},${data.exportInfo.period}\n`;
    csvContent += `Total Events,${data.events.length},${data.exportInfo.period}\n`;
    csvContent += `Export Date,${data.exportInfo.exportedAt},${data.exportInfo.period}\n`;
  } else {
    // Detailed CSV
    csvContent = 'Type,Timestamp,Session ID,Page/Event,Data\n';
    
    // Page Views
    data.pageViews.forEach(pv => {
      csvContent += `Page View,${new Date(pv.timestamp).toISOString()},${pv.sessionId},${pv.page},"${JSON.stringify(pv).replace(/"/g, '""')}"\n`;
    });
    
    // Events
    data.events.forEach(ev => {
      csvContent += `Event,${new Date(ev.timestamp).toISOString()},${ev.sessionId},${ev.eventType},"${JSON.stringify(ev.data).replace(/"/g, '""')}"\n`;
    });
    
    // Clicks
    data.clicks.forEach(click => {
      csvContent += `Click,${new Date(click.timestamp).toISOString()},${click.sessionId},${click.elementType},"${JSON.stringify(click.data).replace(/"/g, '""')}"\n`;
    });
  }
  
  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  });
}

function exportAsExcel(data, type) {
  // For Excel, we'll return a JSON format that can be imported into Excel
  // or use a library like xlsx in the future
  const excelData = {
    metadata: data.metadata,
    exportInfo: data.exportInfo,
    summary: {
      totalVisits: data.pageViews.length,
      uniqueVisitors: new Set(data.pageViews.map(pv => pv.sessionId)).size,
      totalClicks: data.clicks.length,
      totalEvents: data.events.length
    },
    pageViews: data.pageViews,
    events: data.events,
    clicks: data.clicks
  };
  
  const filename = `analytics-export-${new Date().toISOString().split('T')[0]}.xlsx.json`;
  
  return new NextResponse(JSON.stringify(excelData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  });
}

function exportAsPDF(data, type, period) {
  // Generate HTML content for PDF
  const htmlContent = generatePDFHTML(data, type, period);
  
  const filename = `analytics-report-${period}-${new Date().toISOString().split('T')[0]}.html`;
  
  // For now, return HTML that can be printed to PDF by browser
  // In production, you could use libraries like puppeteer or jsPDF
  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  });
}

function generatePDFHTML(data, type, period) {
  const totalVisits = data.pageViews.length;
  const uniqueVisitors = new Set(data.pageViews.map(pv => pv.sessionId)).size;
  const totalClicks = data.clicks.length;
  const totalEvents = data.events.length;
  
  // Calculate popular articles
  const articleViews = {};
  data.pageViews
    .filter(pv => pv.page.startsWith('/articles/'))
    .forEach(pv => {
      const article = pv.page.split('/articles/')[1];
      articleViews[article] = (articleViews[article] || 0) + 1;
    });
  
  const popularArticles = Object.entries(articleViews)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
  
  // Calculate traffic sources
  const sources = {};
  data.pageViews.forEach(pv => {
    const source = pv.referrer ? 
      (pv.referrer.includes('google') ? 'Google' :
       pv.referrer.includes('facebook') ? 'Facebook' :
       pv.referrer.includes('twitter') ? 'Twitter' :
       pv.referrer.includes('linkedin') ? 'LinkedIn' :
       'Other') : 'Direct';
    sources[source] = (sources[source] || 0) + 1;
  });
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Report - ${period}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #1e40af;
            margin: 0;
            font-size: 2.5em;
        }
        .header p {
            color: #6b7280;
            margin: 10px 0 0 0;
            font-size: 1.1em;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .stat-card h3 {
            margin: 0 0 10px 0;
            font-size: 2em;
            font-weight: bold;
        }
        .stat-card p {
            margin: 0;
            opacity: 0.9;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #1e40af;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .table th, .table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        .table th {
            background: #f9fafb;
            font-weight: bold;
            color: #374151;
        }
        .table tr:hover {
            background: #f9fafb;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
        }
        @media print {
            body { background: white; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Analytics Report</h1>
            <p>Tech & The City - ${period.toUpperCase()} Analytics</p>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>${totalVisits}</h3>
                <p>Total Visits</p>
            </div>
            <div class="stat-card">
                <h3>${uniqueVisitors}</h3>
                <p>Unique Visitors</p>
            </div>
            <div class="stat-card">
                <h3>${totalClicks}</h3>
                <p>Total Clicks</p>
            </div>
            <div class="stat-card">
                <h3>${totalEvents}</h3>
                <p>Total Events</p>
            </div>
        </div>
        
        <div class="section">
            <h2>🚀 Most Popular Articles</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Article</th>
                        <th>Views</th>
                    </tr>
                </thead>
                <tbody>
                    ${popularArticles.map(([article, views], index) => `
                        <tr>
                            <td>#${index + 1}</td>
                            <td>${article}</td>
                            <td>${views}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>🌐 Traffic Sources</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Source</th>
                        <th>Visits</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(sources).map(([source, visits]) => `
                        <tr>
                            <td>${source}</td>
                            <td>${visits}</td>
                            <td>${((visits / totalVisits) * 100).toFixed(1)}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>📈 Click-Through Analysis</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Element Type</th>
                        <th>Clicks</th>
                        <th>CTR</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(data.clicks.reduce((acc, click) => {
                        acc[click.elementType] = (acc[click.elementType] || 0) + 1;
                        return acc;
                    }, {})).map(([type, clicks]) => `
                        <tr>
                            <td>${type.replace('_', ' ')}</td>
                            <td>${clicks}</td>
                            <td>${((clicks / totalVisits) * 100).toFixed(2)}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p>Report generated by Tech & The City Analytics System</p>
            <p>Data period: ${data.exportInfo.dateRange.from} to ${data.exportInfo.dateRange.to}</p>
            <p>Total records analyzed: ${data.exportInfo.totalRecords}</p>
        </div>
    </div>
    
    <script>
        // Auto-print when opened
        window.onload = function() {
            setTimeout(() => {
                window.print();
            }, 1000);
        };
    </script>
</body>
</html>
  `;
}
