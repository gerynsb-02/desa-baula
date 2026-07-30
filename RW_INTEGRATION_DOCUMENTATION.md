# RW Data Integration Documentation

## Overview
The RW (Rukun Warga) data management has been integrated into the existing data management system without creating new top-level pages. This follows the user's requirement: "saya mau di bagian data saja tidak usah menambahkan halaman baru dan untuk fieldnya sesuai yang di data saja".

## Architecture

### Firebase Collections
- **`data_statistik/penduduk`**: General population statistics
- **`data_statistik/sumber`**: Data source information  
- **`data_rw`**: Dynamic RW data collection (NEW)

### RW Data Structure
Each RW document in the `data_rw` collection contains:
```javascript
{
  nama: "RW 001",           // RW name
  lokasi: "Tompo Balang",   // Location
  total_penduduk: 245,      // Total population
  laki_laki: 120,          // Male population
  perempuan: 125,          // Female population
  jumlah_kk: 65,           // Number of households
  created_at: Date,        // Creation timestamp
  updated_at: Date         // Last update timestamp
}
```

## Admin Integration

### `/admin/data` Page
The existing admin data page now includes:

1. **RW Management Section**: A new section below the existing data statistics
2. **RW Table**: Displays all RW data in a table format with:
   - RW name, location, total population, gender breakdown, household count
   - Edit and delete actions for each RW
3. **Add RW Button**: Opens a modal to add new RW data
4. **Modal Form**: In-page form for adding/editing RW data without navigation

### Features
- ✅ **No New Pages**: All RW management is integrated into `/admin/data`
- ✅ **Modal-based CRUD**: Add, edit, delete operations use modals
- ✅ **Real-time Updates**: Data refreshes automatically after operations
- ✅ **Consistent UI**: Matches existing admin design patterns

## Public Integration

### `/data` Page
The public data page now:

1. **Fetches Dynamic RW Data**: Replaces static `rwLocations` array with Firebase data
2. **Dynamic Charts**: RW chart uses real data from `data_rw` collection
3. **Dynamic RW Cards**: RW location cards display actual Firebase data
4. **Fallback Handling**: Gracefully handles empty RW data

### Chart Integration
- **RW Chart**: Uses `rwData.map(rw => rw.total_penduduk)` for dynamic values
- **Labels**: Uses `rwData.map(rw => rw.nama)` for RW names
- **Responsive**: Automatically adjusts to number of RWs in database

## Setup Instructions

### 1. Create RW Data
Run the setup script to populate sample RW data:
```bash
node scripts/setup-rw-data.js
```

### 2. Verify Integration
- Visit `/admin/data` to see RW management section
- Add/edit/delete RW data using the modal interface
- Visit `/data` to see dynamic RW data in charts and cards

## File Changes

### Modified Files
- `pages/admin/data/index.js`: Added RW management functionality
- `pages/data/index.js`: Updated to use dynamic RW data
- `components/AdminSidebar.js`: Reverted RW navigation link
- `components/Navbar.js`: Reverted RW navigation link

### New Files
- `scripts/setup-rw-data.js`: Script to populate RW data
- `RW_INTEGRATION_DOCUMENTATION.md`: This documentation

### Deleted Files
- `pages/admin/rw/` (entire directory)
- `pages/rw/` (entire directory)
- `RW_SYSTEM_DOCUMENTATION.md`

## Usage

### Admin Operations
1. **View RW Data**: Navigate to `/admin/data` and scroll to RW section
2. **Add RW**: Click "Tambah RW" button, fill modal form
3. **Edit RW**: Click edit icon on any RW row
4. **Delete RW**: Click delete icon, confirm deletion

### Public Display
- RW data automatically appears in charts and cards on `/data`
- No manual intervention required after admin updates

## Benefits

1. **Unified Management**: All data management in one place
2. **No Navigation Complexity**: No new routes to manage
3. **Consistent UX**: Same patterns as existing data management
4. **Dynamic Content**: Real-time updates without page refreshes
5. **Scalable**: Easy to add more RW data fields if needed

## Future Enhancements

- Add RW-specific statistics (age groups, education levels, etc.)
- Add RW boundary maps or coordinates
- Add RW contact information for public display
- Add RW event calendar integration 