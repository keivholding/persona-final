import { supabaseAdmin } from "./supabase";

export class UploadService {
  static async uploadImage(
    file: Express.Multer.File,
    userId: number
  ): Promise<string> {
    try {
      console.log(
        "Starting upload for user:",
        userId,
        "file:",
        file.originalname
      );

      // Generate unique filename
      const fileExtension = file.originalname.split(".").pop();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `${userId}/${Date.now()}_${randomId}.${fileExtension}`;

      console.log("Generated filename:", fileName);

      // Upload to Supabase Storage
      const { data, error } = await supabaseAdmin.storage
        .from("attribute-images")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      console.log("Upload successful:", data);

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from("attribute-images")
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Upload service error:", error);
      throw error;
    }
  }

  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split("/");
      const bucketIndex = urlParts.findIndex(
        (part) => part === "attribute-images"
      );

      if (bucketIndex === -1) {
        throw new Error("Invalid image URL format");
      }

      const filePath = urlParts.slice(bucketIndex + 1).join("/");

      const { error } = await supabaseAdmin.storage
        .from("attribute-images")
        .remove([filePath]);

      if (error) {
        console.error("Failed to delete image:", error);
        // Don't throw error for deletion failures to avoid blocking other operations
      }
    } catch (error) {
      console.error("Delete image error:", error);
      // Don't throw error for deletion failures
    }
  }
}
