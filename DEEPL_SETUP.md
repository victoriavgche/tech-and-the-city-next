# 🌍 DeepL Translation Setup

Το σύστημα χρησιμοποιεί **DeepL** για επαγγελματικές μεταφράσεις υψηλής ποιότητας!

## 🎁 DeepL Free API (500,000 χαρακτήρες/μήνα ΔΩΡΕΑΝ!)

### Βήμα 1: Δημιουργία λογαριασμού DeepL

1. Πήγαινε στο: https://www.deepl.com/pro-api
2. Κάνε κλικ στο **"Sign up for free"**
3. Επίλεξε **"DeepL API Free"**
4. Συμπλήρωσε τα στοιχεία σου
5. Επιβεβαίωσε το email σου

### Βήμα 2: Πάρε το API Key

1. Μπες στο https://www.deepl.com/account/summary
2. Πήγαινε στο **"Account"** → **"API Keys"**
3. Αντίγραψε το **Authentication Key**
4. Θα είναι κάτι σαν: `12345678-1234-1234-1234-123456789abc:fx`

### Βήμα 3: Πρόσθεσε το API Key στο project

Δημιούργησε ή άνοιξε το αρχείο `.env.local` στο root του project:

```bash
# DeepL API Configuration
DEEPL_API_KEY=your_api_key_here:fx
```

### Βήμα 4: Restart του server

```bash
npm run dev
```

## 🎯 Τι παίρνεις με το Free Plan:

- ✅ **500,000 χαρακτήρες/μήνα** (περίπου 100-200 άρθρα)
- ✅ **Επαγγελματική ποιότητα** μετάφρασης
- ✅ **Υποστήριξη 31 γλωσσών**
- ✅ **Καμία πιστωτική κάρτα** δεν χρειάζεται
- ✅ **API access** για developers

## 🔄 Αν δεν έχεις API Key

Το σύστημα έχει **αυτόματο fallback** στο Google Translate (δωρεάν, χωρίς API key).
Θα λειτουργεί κανονικά αλλά με λίγο χειρότερη ποιότητα μετάφρασης.

## 📊 Παρακολούθηση χρήσης

Δες πόσους χαρακτήρες έχεις χρησιμοποιήσει:
https://www.deepl.com/account/usage

## 🚀 Upgrade σε Pro (προαιρετικό)

Αν θέλεις περισσότερους χαρακτήρες:
- **DeepL API Pro**: από €5.49/μήνα για 1,000,000 χαρακτήρες
- Unlimited API requests
- Priority support

## 💡 Tips

1. **Cache**: Το σύστημα κάνει cache τις μεταφράσεις για να μην ξαναμεταφράζει το ίδιο κείμενο
2. **Smart detection**: Ανιχνεύει αυτόματα αν το κείμενο είναι Ελληνικά ή Αγγλικά
3. **Fallback**: Αν το DeepL αποτύχει ή τελειώσουν οι χαρακτήρες, χρησιμοποιεί Google Translate

## ✅ Test

Για να δοκιμάσεις αν λειτουργεί:

```bash
# Check if API key is loaded
console.log(process.env.DEEPL_API_KEY ? 'DeepL configured ✓' : 'Using fallback')
```

Ή απλά πάτα τα κουμπιά EN/EL στο site σου!

