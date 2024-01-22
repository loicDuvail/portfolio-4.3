CREATE TABLE IF NOT EXISTS recipients (
    id INT NOT NULL AUTO_INCREMENT, 
    routeIdentifier CHAR(36), 
    email VARCHAR(100), 
    count INT DEFAULT 0, 
    
    PRIMARY KEY (id)
);