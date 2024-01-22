CREATE TABLE IF NOT EXISTS projects(
    id INT NOT NULL AUTO_INCREMENT,
    project_name VARCHAR(100),
    description TEXT,
    description_fr TEXT,
    what_i_learned TEXT,
    what_i_learned_fr TEXT,
    img VARCHAR(200),
    git_link VARCHAR(200),
    live_demo_link VARCHAR(200),
    
    PRIMARY KEY (id)
);