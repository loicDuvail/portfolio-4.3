CREATE TABLE IF NOT EXISTS webAnalytics(
    id INT NOT NULL AUTO_INCREMENT, 
    date VARCHAR(50), 
    ip VARCHAR(32),
    route VARCHAR(100), 
    PRIMARY KEY (id)
);