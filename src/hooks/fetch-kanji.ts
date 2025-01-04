import { Kanji } from '@/components/Lesson';

export async function fetchKanji(character: string): Promise<Kanji>{
  try{
    const response = await fetch(`https://kanjiapi.dev/v1/kanji/${character}`);
    if (!response.ok){
      throw new Error('Failed to fetch kanji data');
    }
    const data = await response.json();
    console.log('Full API Response:', data);
    const kanji: Kanji = {
      character: data.kanji, // Extract character
      meaning: Array.isArray(data.meanings) ? data.meanings.join('; ') : 'No meanings available',
      readings: [
        ...(Array.isArray(data.kun_readings)
          ? data.kun_readings.map((kun: string) => ({ value: kun, type: 'kun' }))
          : []),
        ...(Array.isArray(data.on_readings)
          ? data.on_readings.map((on: string) => ({ value: on, type: 'on' }))
          : []),
      ],
    };
    
    return kanji;
  } catch (error) {
    console.error('Error fetching kanji data:', error);
    throw error;
  }
}