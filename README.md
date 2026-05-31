# SmartWardrobe

SmartWardrobe is an Expo React Native app for organizing clothing items, building outfits, and tracking how often pieces get worn. The app stores data locally with AsyncStorage and includes camera/gallery support for attaching photos to wardrobe items.

## Features

- Add, edit, search, and delete clothing items
- Tag items by category, season, color, brand, and size
- Attach item photos from the gallery or camera
- Build outfits from saved wardrobe pieces
- Mark outfits as favorites
- Log outfit wear history and increment wear counts automatically
- View dashboard and profile stats such as total items, favorites, logs, and most-worn items

## Tech Stack

- React Native
- Expo
- React Navigation
- AsyncStorage
- Expo Camera
- Expo Image Picker

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- Expo Go on a physical device, or an iOS/Android simulator

### Installation

```bash
npm install
```

### Run the App

```bash
npm start
```

You can also launch a specific target:

```bash
npm run ios
npm run android
npm run web
```

## Permissions

The app requests device permissions when needed:

- Camera access for taking clothing photos
- Photo library access for selecting item images

If permissions are denied, image capture or selection will not work until access is enabled in device settings.

## How It Works

### Wardrobe

Use the `Wardrobe` tab to manage clothing items. Each item can include:

- Name
- Category
- Season
- Color
- Brand
- Size
- Description
- Photo

Items can be filtered by category and season, and searched by name, color, or brand.

### Outfit Builder

Use the `Builder` tab to create outfits from saved items. A valid outfit requires:

- `topId`
- `bottomId`

Shoes and outerwear are optional.

### Outfits

Use the `Outfits` tab to:

- Review saved outfits
- Favorite or unfavorite an outfit
- Log wear for an outfit
- Delete outfits

Logging wear updates both the outfit wear count and the wear count of the linked clothing items.

### Home and Profile

The `Home` and `Profile` tabs summarize local wardrobe activity, including:

- Total item count
- Outfit count
- Favorite outfit count
- Wear log count
- Most-worn item
- Wardrobe breakdown by category

## Data Storage

All app data is stored locally on the device using AsyncStorage.

Stored collections:

- `wardrobeItems`
- `wardrobeOutfits`
- `wearLogs`

There is currently no backend, cloud sync, or account system.

## Project Structure

```text
SmartWardrobe/
├── App.js
├── components/
│   ├── AddItemModal.js
│   ├── ClothingItemCard.js
│   └── OutfitCard.js
├── screens/
│   ├── HomeScreen.js
│   ├── OutfitBuilderScreen.js
│   ├── OutfitsScreen.js
│   ├── ProfileScreen.js
│   └── WardrobeScreen.js
├── utils/
│   ├── constants.js
│   └── storage.js
├── assets/
├── app.json
├── index.js
└── package.json
```

## Current Limitations

- Data is local to one device
- No authentication or user profiles
- No cloud backup or sharing
- No automated test suite is configured yet
- Category and season values are free-text inputs, so inconsistent labels are possible

## Future Improvements

- Add cloud sync and user accounts
- Normalize category and season input with pickers
- Add calendar-based outfit planning
- Add laundry/rotation reminders
- Add automated tests

## Scripts

```bash
npm start
npm run ios
npm run android
npm run web
```
