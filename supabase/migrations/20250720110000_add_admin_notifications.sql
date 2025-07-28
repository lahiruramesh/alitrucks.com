-- Create admin notifications table for vehicle approval notifications
CREATE TABLE public.admin_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vehicle_submitted', 'vehicle_approved', 'vehicle_rejected', 'new_user')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for efficient queries
CREATE INDEX idx_admin_notifications_user_id ON public.admin_notifications(user_id);
CREATE INDEX idx_admin_notifications_read ON public.admin_notifications(read);
CREATE INDEX idx_admin_notifications_created_at ON public.admin_notifications(created_at DESC);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for admin notifications
-- Only admins can see notifications assigned to them
CREATE POLICY "Admins can view their notifications" ON public.admin_notifications
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() AND 
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
  );

-- Only the system can create notifications (through service role)
CREATE POLICY "System can create notifications" ON public.admin_notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Only admins can update their own notifications
CREATE POLICY "Admins can update their notifications" ON public.admin_notifications
  FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid() AND 
    (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin'
  );

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_admin_notifications_updated_at
  BEFORE UPDATE ON public.admin_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
