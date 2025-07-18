import { supabase } from '../supabaseClient';

// Upload un fichier dans le bucket 'justificatifs'. Retourne l'URL publique
export async function uploadJustificatif(file: File, deboursId: string): Promise<string> {
  const filePath = `${deboursId}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from('justificatifs').upload(filePath, file);
  if (error) throw error;
  // Récupère l'URL publique
  const { data: publicUrlData } = supabase.storage.from('justificatifs').getPublicUrl(filePath);
  return publicUrlData.publicUrl;
}
