-- Create storage bucket for chat attachments
insert into storage.buckets (id, name, public) values ('chat-attachments', 'chat-attachments', true);

-- Set up storage policies for chat attachments
create policy "Allow authenticated users to upload files"
on storage.objects for insert
with check (bucket_id = 'chat-attachments' and auth.role() = 'authenticated');

create policy "Allow authenticated users to view files"
on storage.objects for select
using (bucket_id = 'chat-attachments' and auth.role() = 'authenticated');

create policy "Allow users to delete their own files"
on storage.objects for delete
using (bucket_id = 'chat-attachments' and auth.uid()::text = (storage.foldername(name))[1]);
