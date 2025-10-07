import { NextResponse } from 'next/server';
import { 
  getBasicStats, 
  getPopularPages, 
  getTrafficSources, 
  getEngagementMetrics,
  getDeviceAnalytics,
  getSocialSharingStats,
  getRealTimeStats,
  getHourlyTrafficAnalysis,
  loadAnalytics
} from '@/lib/analytics';
// jsPDF will be imported dynamically in the function

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const period = searchParams.get('period') || 'all';
    
    // Get exact same data as the analytics tabs
    console.log('Generating analytics data for period:', period);
    
    // Validate that we have data
    const basicStats = getBasicStats(period);
    console.log('Basic stats:', basicStats);
    
    const analyticsData = {
      // Overview Tab - Exact same data structure
      overview: {
        keyMetrics: {
          totalVisits: basicStats.totalViews,
          uniqueVisitors: basicStats.uniquePages,
          todayViews: basicStats.todayViews,
          avgTimeOnPage: getEngagementMetrics(period).averageTime
        },
        trafficSources: getTrafficSources(period).slice(0, 5) // Top 5 only like in Overview tab
      },
      
      // Real-Time Tab - Exact same data
      realtime: getRealTimeStats(),
      
      // Peak Hours Tab - Exact same data
      peakHours: {
        topBusiestHours: getHourlyTrafficAnalysis(period).peakHours.totalActivity.slice(0, 3)
      },
      
      // Social Sharing Tab - Exact same data structure
      social: {
        summaryStats: {
          totalShares: getSocialSharingStats(period).totalShares,
          uniqueUsers: getSocialSharingStats(period).totalUniqueUsers,
          platformsUsed: getSocialSharingStats(period).platformStats.length
        },
        platformStats: getSocialSharingStats(period).platformStats,
        sharedContent: getSocialSharingStats(period).urlStats.slice(0, 5) // Top 5 only like in tab
      },
      
      // Traffic Sources Tab - Exact same data
      sources: getTrafficSources(period),
      
      // Popular Content Tab - Exact same data
      content: getPopularPages(10, period),
      
      // Additional comprehensive data
      basic: basicStats,
      engagement: getEngagementMetrics(period),
      devices: getDeviceAnalytics(period),
      hourly: getHourlyTrafficAnalysis(period),
      ctr: {
        ctr: basicStats.ctr,
        totalClicks: basicStats.totalClicks,
        totalViews: basicStats.totalViews
      },
      
      metadata: {
        period: period,
        extractedAt: new Date().toISOString(),
        dataPoints: basicStats.totalViews + basicStats.totalEvents + basicStats.totalClicks
      }
    };

    if (format === 'json') {
      return NextResponse.json(analyticsData);
    } else if (format === 'csv') {
      return await generateCSV(analyticsData, period);
    } else if (format === 'pdf') {
      try {
        return await generatePDF(analyticsData, period);
      } catch (pdfError) {
        console.error('PDF generation failed:', pdfError);
        return NextResponse.json({ 
          error: 'PDF generation failed', 
          details: pdfError.message 
        }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Analytics extract error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

async function generateCSV(data, period) {
  try {
    const csvRows = [];
    
    // Header
    csvRows.push('Analytics Data Export');
    csvRows.push(`Period: ${period}`);
    csvRows.push(`Extracted: ${data.metadata.extractedAt}`);
    csvRows.push('');
    
    // Overview Tab Section - Exact same as Overview tab
    csvRows.push('OVERVIEW TAB DATA');
    csvRows.push('');
    csvRows.push('Key Metrics');
    csvRows.push('Metric,Value');
    csvRows.push(`Total Visits,${data.overview.keyMetrics.totalVisits}`);
    csvRows.push(`Unique Visitors,${data.overview.keyMetrics.uniqueVisitors}`);
    csvRows.push(`Today Views,${data.overview.keyMetrics.todayViews}`);
    csvRows.push(`Avg. Time on Page (ms),${data.overview.keyMetrics.avgTimeOnPage}`);
    csvRows.push('');
    csvRows.push('Traffic Sources (Top 5)');
    csvRows.push('Source,Count');
    data.overview.trafficSources.forEach(source => {
      csvRows.push(`${source.source},${source.count}`);
    });
    csvRows.push('');
    
    // Real-Time Tab Section - Exact same as Real-Time tab
    csvRows.push('REAL-TIME TAB DATA');
    csvRows.push('');
    csvRows.push('Last 24 Hours');
    csvRows.push('Metric,Value');
    csvRows.push(`Page Views,${data.realtime.last24Hours.pageViews}`);
    csvRows.push(`Social Shares,${data.realtime.last24Hours.socialShares}`);
    csvRows.push(`Unique Pages,${data.realtime.last24Hours.uniquePages}`);
    csvRows.push('');
    csvRows.push('Top Pages (24h)');
    csvRows.push('URL,Count');
    data.realtime.last24Hours.topPages.forEach(page => {
      csvRows.push(`${page.url},${page.count}`);
    });
    csvRows.push('');
    csvRows.push('Last Hour');
    csvRows.push('Metric,Value');
    csvRows.push(`Page Views,${data.realtime.lastHour.pageViews}`);
    csvRows.push(`Social Shares,${data.realtime.lastHour.socialShares}`);
    csvRows.push(`Unique Pages,${data.realtime.lastHour.uniquePages}`);
    csvRows.push('');
    csvRows.push('Top Pages (1h)');
    csvRows.push('URL,Count');
    data.realtime.lastHour.topPages.forEach(page => {
      csvRows.push(`${page.url},${page.count}`);
    });
    csvRows.push('');
    
    // Peak Hours Tab Section - Exact same as Peak Hours tab
    csvRows.push('PEAK HOURS TAB DATA');
    csvRows.push('');
    csvRows.push('Top 3 Busiest Hours');
    csvRows.push('Rank,Hour,Page Views,Social Shares,Total Activity');
    data.peakHours.topBusiestHours.forEach((hour, index) => {
      csvRows.push(`${index + 1},${hour.hourLabel},${hour.pageViews},${hour.socialShares || 0},${hour.totalActivity}`);
    });
    csvRows.push('');
    
    // Social Sharing Tab Section - Exact same as Social Sharing tab
    csvRows.push('SOCIAL SHARING TAB DATA');
    csvRows.push('');
    csvRows.push('Summary Stats');
    csvRows.push('Metric,Value');
    csvRows.push(`Total Shares,${data.social.summaryStats.totalShares}`);
    csvRows.push(`Unique Users,${data.social.summaryStats.uniqueUsers}`);
    csvRows.push(`Platforms Used,${data.social.summaryStats.platformsUsed}`);
    csvRows.push('');
    csvRows.push('Platforms & Stats');
    csvRows.push('Platform,Total Shares,Unique Users');
    data.social.platformStats.forEach(platform => {
      csvRows.push(`${platform.platform},${platform.count},${platform.uniqueUsers}`);
    });
    csvRows.push('');
    csvRows.push('Shared Content (Top 5)');
    csvRows.push('Content Type,Title,Total Shares,Unique Users');
    data.social.sharedContent.forEach(content => {
      const isArticle = content.url.includes('/articles/');
      const contentType = isArticle ? '📰 Article' : '🎉 Event';
      csvRows.push(`${contentType},${content.title},${content.totalShares},${content.uniqueUsers}`);
    });
    csvRows.push('');
    
    // Traffic Sources Tab Section - Exact same as Traffic Sources tab
    csvRows.push('TRAFFIC SOURCES TAB DATA');
    csvRows.push('');
    csvRows.push('Source,Visits');
    data.sources.forEach(source => {
      csvRows.push(`${source.source},${source.count}`);
    });
    csvRows.push('');
    
    // Popular Content Tab Section - Exact same as Popular Content tab
    csvRows.push('POPULAR CONTENT TAB DATA');
    csvRows.push('');
    csvRows.push('Rank,Page URL,Views');
    data.content.forEach((page, index) => {
      csvRows.push(`${index + 1},${page.url},${page.count}`);
    });
    csvRows.push('');
    csvRows.push('');
    
    // Metadata
    csvRows.push('METADATA');
    csvRows.push('Field,Value');
    csvRows.push(`Period,${data.metadata.period}`);
    csvRows.push(`Data Points,${data.metadata.dataPoints}`);
    csvRows.push(`Extracted At,${data.metadata.extractedAt}`);
    
    const csvContent = csvRows.join('\n');
    const csvBuffer = Buffer.from(csvContent, 'utf8');
    
    const filename = `analytics-data-${period}-${new Date().toISOString().split('T')[0]}.csv`;
    
    return new NextResponse(csvBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': csvBuffer.length.toString()
      }
    });
    
  } catch (error) {
    console.error('CSV generation error:', error);
    throw error;
  }
}

async function generatePDF(data, period) {
  try {
    // Dynamic import for jsPDF to work with Next.js
    const { default: jsPDF } = await import('jspdf');
    
    // Check if jsPDF was imported successfully
    if (!jsPDF) {
      throw new Error('Failed to import jsPDF');
    }
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;
    
    // Helper function to add text with word wrap
    const addText = (text, x, y, maxWidth = pageWidth - 40) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * 7);
    };
    
    // Helper function to add a new page if needed
    const checkNewPage = (requiredSpace = 20) => {
      if (yPosition + requiredSpace > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };
    
    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Analytics Report', 20, yPosition);
    
    // Period and date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Period: ${period === 'all' ? 'All Time' : period}`, 20, yPosition + 10);
    yPosition = addText(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition + 5);
    yPosition += 10;
    
    // Overview Tab Section - Exact same as Overview tab
    checkNewPage(30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('OVERVIEW TAB DATA', 20, yPosition);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Key Metrics', 20, yPosition + 10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Total Visits: ${data.overview.keyMetrics.totalVisits}`, 20, yPosition + 5);
    yPosition = addText(`Unique Visitors: ${data.overview.keyMetrics.uniqueVisitors}`, 20, yPosition + 5);
    yPosition = addText(`Today Views: ${data.overview.keyMetrics.todayViews}`, 20, yPosition + 5);
    yPosition = addText(`Avg. Time on Page: ${Math.round(data.overview.keyMetrics.avgTimeOnPage / 1000)}s`, 20, yPosition + 5);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Traffic Sources (Top 5)', 20, yPosition + 10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    data.overview.trafficSources.forEach(source => {
      checkNewPage(10);
      yPosition = addText(`${source.source}: ${source.count} visits`, 20, yPosition + 5);
    });
    yPosition += 10;
    
    // Real-Time Tab Section - Exact same as Real-Time tab
    checkNewPage(30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('REAL-TIME TAB DATA', 20, yPosition);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Last 24 Hours', 20, yPosition + 10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Page Views: ${data.realtime.last24Hours.pageViews}`, 20, yPosition + 5);
    yPosition = addText(`Social Shares: ${data.realtime.last24Hours.socialShares}`, 20, yPosition + 5);
    yPosition = addText(`Unique Pages: ${data.realtime.last24Hours.uniquePages}`, 20, yPosition + 5);
    
    yPosition = addText('Top Pages (24h):', 20, yPosition + 10);
    data.realtime.last24Hours.topPages.forEach((page, index) => {
      checkNewPage(10);
      yPosition = addText(`${index + 1}. ${page.url} - ${page.count} views`, 30, yPosition + 5);
    });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Last Hour', 20, yPosition + 10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Page Views: ${data.realtime.lastHour.pageViews}`, 20, yPosition + 5);
    yPosition = addText(`Social Shares: ${data.realtime.lastHour.socialShares}`, 20, yPosition + 5);
    yPosition = addText(`Unique Pages: ${data.realtime.lastHour.uniquePages}`, 20, yPosition + 5);
    
    yPosition = addText('Top Pages (1h):', 20, yPosition + 10);
    data.realtime.lastHour.topPages.forEach((page, index) => {
      checkNewPage(10);
      yPosition = addText(`${index + 1}. ${page.url} - ${page.count} views`, 30, yPosition + 5);
    });
    yPosition += 10;
    
    // Peak Hours Tab Section - Exact same as Peak Hours tab
    checkNewPage(30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('PEAK HOURS TAB DATA', 20, yPosition);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Top 3 Busiest Hours', 20, yPosition + 10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    data.peakHours.topBusiestHours.forEach((hour, index) => {
      checkNewPage(15);
      yPosition = addText(`${index + 1}. ${hour.hourLabel}`, 20, yPosition + 5);
      yPosition = addText(`   Page Views: ${hour.pageViews}`, 30, yPosition + 5);
      yPosition = addText(`   Social Shares: ${hour.socialShares || 0}`, 30, yPosition + 5);
      yPosition = addText(`   Total Activity: ${hour.totalActivity}`, 30, yPosition + 5);
    });
    yPosition += 10;
    
    // Social Sharing Tab Section - Exact same as Social Sharing tab
    checkNewPage(30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('SOCIAL SHARING TAB DATA', 20, yPosition);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Summary Stats', 20, yPosition + 10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Total Shares: ${data.social.summaryStats.totalShares}`, 20, yPosition + 5);
    yPosition = addText(`Unique Users: ${data.social.summaryStats.uniqueUsers}`, 20, yPosition + 5);
    yPosition = addText(`Platforms Used: ${data.social.summaryStats.platformsUsed}`, 20, yPosition + 5);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Platforms & Stats', 20, yPosition + 10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    data.social.platformStats.forEach(platform => {
      checkNewPage(10);
      yPosition = addText(`${platform.platform}: ${platform.count} shares (${platform.uniqueUsers} users)`, 20, yPosition + 5);
    });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Shared Content (Top 5)', 20, yPosition + 10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    data.social.sharedContent.forEach(content => {
      checkNewPage(10);
      const isArticle = content.url.includes('/articles/');
      const contentType = isArticle ? 'Article' : 'Event';
      yPosition = addText(`${contentType}: ${content.title}`, 20, yPosition + 5);
      yPosition = addText(`   Total Shares: ${content.totalShares}`, 30, yPosition + 5);
      yPosition = addText(`   Unique Users: ${content.uniqueUsers}`, 30, yPosition + 5);
    });
    yPosition += 10;
    
    // Traffic Sources Tab Section - Exact same as Traffic Sources tab
    checkNewPage(30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('TRAFFIC SOURCES TAB DATA', 20, yPosition);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    data.sources.forEach(source => {
      checkNewPage(10);
      yPosition = addText(`${source.source}: ${source.count} visits`, 20, yPosition + 5);
    });
    yPosition += 10;
    
    // Popular Content Tab Section - Exact same as Popular Content tab
    checkNewPage(30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('POPULAR CONTENT TAB DATA', 20, yPosition);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    data.content.forEach((page, index) => {
      checkNewPage(10);
      yPosition = addText(`${index + 1}. ${page.url} - ${page.count} views`, 20, yPosition + 5);
    });
    yPosition += 10;
    
    // Summary Section
    checkNewPage(30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Report Summary', 20, yPosition);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Period: ${period === 'all' ? 'All Time' : period}`, 20, yPosition + 5);
    yPosition = addText(`Total Data Points: ${data.metadata.dataPoints}`, 20, yPosition + 5);
    yPosition = addText(`Extracted: ${new Date(data.metadata.extractedAt).toLocaleString()}`, 20, yPosition + 5);
    
    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    const filename = `analytics-report-${period}-${new Date().toISOString().split('T')[0]}.pdf`;
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}
