import dotenv from 'dotenv';

dotenv.config();

export const googleSheetsConfig = {
  sheetIds: process.env.GOOGLE_SHEET_IDS?.split(',') || [],
};