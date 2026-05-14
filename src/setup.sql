-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Project Table
-- ========================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Projects
-- ========================================
INSERT INTO project (organization_id, title, description, location, date) VALUES

-- BrightFuture Builders 
(1, 'School Renovation', 'Renovating classrooms in underserved areas', 'Johannesburg', '2026-06-10'),
(1, 'Community Housing Build', 'Constructing affordable housing units', 'Pretoria', '2026-06-15'),
(1, 'Bridge Repair Initiative', 'Repairing damaged pedestrian bridges', 'Soweto', '2026-06-20'),
(1, 'Public Library Project', 'Building a community-access library', 'Midrand', '2026-06-25'),
(1, 'Shelter Upgrade Program', 'Improving homeless shelter facilities', 'Sandton', '2026-06-30'),

-- GreenHarvest Growers 
(2, 'Urban Farming Initiative', 'Establishing rooftop gardens', 'Johannesburg', '2026-07-05'),
(2, 'Tree Planting Campaign', 'Planting trees in urban areas', 'Pretoria', '2026-07-10'),
(2, 'Soil Restoration Project', 'Improving soil for sustainable farming', 'Limpopo', '2026-07-15'),
(2, 'Community Garden Setup', 'Creating shared garden spaces', 'Soweto', '2026-07-20'),
(2, 'Water Conservation Drive', 'Implementing efficient irrigation systems', 'Mpumalanga', '2026-07-25'),

-- UnityServe Volunteers 
(3, 'Food Distribution Program', 'Providing meals to families in need', 'Johannesburg', '2026-08-01'),
(3, 'Clothing Donation Drive', 'Collecting and distributing clothing', 'Pretoria', '2026-08-05'),
(3, 'Health Outreach Camp', 'Offering free health checkups', 'Durban', '2026-08-10'),
(3, 'Education Support Program', 'Tutoring underprivileged students', 'Cape Town', '2026-08-15'),
(3, 'Disaster Relief Prep', 'Preparing emergency supply kits', 'Port Elizabeth', '2026-08-20');