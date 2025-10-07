# Admin Panel Setup για Production

Αυτός ο οδηγός εξηγεί πώς να ρυθμίσεις το admin panel ώστε να λειτουργεί σωστά τόσο σε local development όσο και σε production (Vercel).

## Πώς λειτουργεί

Το σύστημα χρησιμοποιεί δύο διαφορετικές προσεγγίσεις:

- **Development (Local)**: Γράφει απευθείας στο filesystem (`content/posts/`)
- **Production (Vercel)**: Χρησιμοποιεί GitHub API για να κάνει commit τις αλλαγές

## Βήματα για Production Setup

### 1. Δημιουργία GitHub Personal Access Token

1. Πήγαινε στο GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Κάνε κλικ στο "Generate new token" → "Generate new token (classic)"
3. Δώσε ένα όνομα, π.χ. "Tech and the City Admin"
4. Επέλεξε τα παρακάτω permissions:
   - `repo` (Full control of private repositories) - **ΑΠΑΡΑΙΤΗΤΟ**
5. Κάνε κλικ "Generate token"
6. **ΠΡΟΣΟΧΗ**: Αντίγραψε το token τώρα - δεν θα το ξαναδείς!

### 2. Προσθήκη Environment Variable στο Vercel

1. Πήγαινε στο Vercel Dashboard
2. Επέλεξε το project "tech-and-the-city-next"
3. Πήγαινε στο Settings → Environment Variables
4. Πρόσθεσε το παρακάτω:
   - **Name**: `GITHUB_TOKEN`
   - **Value**: Το Personal Access Token που δημιούργησες
   - **Environment**: Production, Preview, Development (όλα)
5. Κάνε κλικ "Save"

### 3. Redeploy το Project

Μετά την προσθήκη του environment variable:

1. Πήγαινε στο Deployments tab
2. Βρες το τελευταίο deployment
3. Κάνε κλικ στα τρία τελείες (···) → "Redeploy"
4. Επιβεβαίωσε το redeploy

## Testing

### Local Testing (Development)

```bash
npm run dev
```

Πήγαινε στο `http://localhost:3000/admin-TC25` και δοκίμασε:
- ✅ Δημιουργία νέου post
- ✅ Edit υπάρχοντος post
- ✅ Publish/Unpublish
- ✅ Delete

Οι αλλαγές θα γίνονται απευθείας στο filesystem.

### Production Testing

1. Πήγαινε στο production URL: `https://tech-and-the-city-next.vercel.app/admin-TC25`
2. Login με τα credentials
3. Δοκίμασε τις λειτουργίες του admin panel

Οι αλλαγές θα γίνονται μέσω GitHub API και θα δημιουργούνται commits αυτόματα.

## Πώς να επαληθεύσεις ότι δουλεύει

Μετά από κάθε αλλαγή στο production:

1. Πήγαινε στο GitHub repository
2. Δες τα πρόσφατα commits - θα πρέπει να βλέπεις commits όπως:
   - "Create new post: [τίτλος]"
   - "Update post: [τίτλος]"
   - "Update post status to: published"
   - "Delete post: [slug]"

3. Το Vercel θα κάνει auto-deploy τις αλλαγές μέσα σε 1-2 λεπτά

## Troubleshooting

### "Admin features are disabled in production"

Αυτό σημαίνει ότι:
- Δεν έχεις ορίσει το `GITHUB_TOKEN` environment variable, ή
- Το token δεν έχει τα σωστά permissions

**Λύση**: 
1. Έλεγξε ότι το `GITHUB_TOKEN` υπάρχει στο Vercel
2. Έλεγξε ότι το token έχει `repo` permissions
3. Κάνε redeploy

### "Failed to update post via GitHub"

**Πιθανές αιτίες**:
- Το token έχει λήξει
- Το repository όνομα ή owner είναι λάθος στο `lib/github-admin.js`
- Network issues

**Λύση**:
1. Έλεγξε τα logs στο Vercel
2. Δημιούργησε νέο token αν χρειάζεται
3. Επιβεβαίωσε ότι το `repoOwner` και `repoName` είναι σωστά

### Οι αλλαγές δεν φαίνονται αμέσως

Αυτό είναι φυσιολογικό! Η διαδικασία είναι:

1. Admin panel → GitHub API → Commit
2. GitHub → Webhook → Vercel
3. Vercel → Build → Deploy

Συνολικός χρόνος: **1-3 λεπτά**

## Repository Configuration

Το σύστημα είναι ρυθμισμένο για:

- **Owner**: `victoriavgche`
- **Repository**: `tech-and-the-city-next`
- **Content Path**: `content/posts/`

Αν χρειαστεί να αλλάξεις αυτά, επεξεργάσου το `lib/github-admin.js`:

```javascript
this.repoOwner = 'victoriavgche';  // Αλλαγή εδώ
this.repoName = 'tech-and-the-city-next';  // Αλλαγή εδώ
```

## Security Notes

⚠️ **ΠΡΟΣΟΧΗ**:
- Μην κάνεις commit το GitHub token στο repository
- Μην το μοιραστείς με κανέναν
- Αν το token διαρρεύσει, ανάκλησέ το αμέσως και δημιούργησε νέο

## Χρήσιμα Commands

```bash
# Development
npm run dev

# Build για production
npm run build

# Test production build locally
npm run start
```

## Support

Αν αντιμετωπίσεις προβλήματα:

1. Έλεγξε τα Vercel logs
2. Έλεγξε τα browser console logs
3. Έλεγξε το GitHub repository για commits
4. Επικοινώνησε με τον developer

---

**Έτοιμο!** Τώρα έχεις ένα πλήρως λειτουργικό admin panel που δουλεύει και σε production! 🚀

