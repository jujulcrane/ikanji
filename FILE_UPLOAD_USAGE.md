# Lesson File Upload Feature

## Overview
You can now import lessons into your iKanji app by uploading a CSV file. This makes it easy to create lessons from existing vocabulary lists or bulk import data.

## How to Use

### 1. Access the Upload Feature
Navigate to **Dashboard → Create New Lesson**. You'll see a new section at the top called "Import Lesson from File" with two buttons:
- **Download Template** - Get a sample CSV file showing the correct format
- **Upload CSV File** - Select your CSV file to import

### 2. File Format
The CSV file should follow this structure:

```csv
LESSON_NAME,Your Lesson Name Here
KANJI
character,meaning,kun-readings,on-readings
水,water,みず,スイ
山,mountain,やま,サン|セン
PRACTICE_SENTENCES
japanese,english
水を飲む,Drink water
山に登る,Climb a mountain
```

#### Format Rules:
1. **First line**: `LESSON_NAME,Your Lesson Name`
2. **Kanji section** (optional):
   - Header: `KANJI`
   - Column headers: `character,meaning,kun-readings,on-readings`
   - Multiple readings separated by `|` (pipe character)
   - Example: `スイ|サン` for multiple on-readings
3. **Practice Sentences** (required):
   - Header: `PRACTICE_SENTENCES`
   - Column headers: `japanese,english`
   - One sentence per line

### 3. Example Files

#### Vocabulary-Only Lesson (Like Quartet Lesson 3)
```csv
LESSON_NAME,Quartet lesson 3 vocab
PRACTICE_SENTENCES
japanese,english
富士(山),ふじ(さん) (Mt. Fuji)
登山(する),とざん(する) (to climb a mountain)
ガイド,がいど (guide)
```

#### Full Lesson with Kanji
```csv
LESSON_NAME,My Japanese Lesson
KANJI
character,meaning,kun-readings,on-readings
水,water,みず,スイ
火,fire,ひ,カ
PRACTICE_SENTENCES
japanese,english
水を飲む,Drink water
火が強い,The fire is strong
```

### 4. Ready-to-Use Templates

Two template files are available in the project root:
- **`lesson_template.csv`** - Generic template (download via the UI)
- **`quartet_lesson3_template.csv`** - Pre-filled with Quartet Lesson 3 vocabulary (117 items)

### 5. Upload Process
1. Click "Upload CSV File"
2. Select your CSV file
3. The form will automatically populate with:
   - Lesson name
   - Kanji list (if provided)
   - Practice sentences
4. Review the imported data
5. Make any manual edits if needed
6. Click "Create Lesson" to save

### 6. Notes
- You can upload a file and then manually add more kanji or sentences
- The lesson name from the file can be edited after import
- If your CSV has formatting issues, you'll see an error message explaining what went wrong
- Kanji section is optional - vocabulary-only lessons are supported

## Uploading Quartet Lesson 3

To upload the Quartet Lesson 3 vocabulary:
1. Use the file `quartet_lesson3_template.csv` located in the project root
2. Navigate to Dashboard → Create New Lesson
3. Click "Upload CSV File"
4. Select `quartet_lesson3_template.csv`
5. Click "Create Lesson"

Done! All 117 vocabulary items will be imported.
