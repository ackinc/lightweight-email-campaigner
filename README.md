# Khonvo Hiring Challenge

[Problem statement](https://docs.google.com/document/d/1y4EiJWGMrg7ArXrEyvXppjl4JfCUfB3dHi8exHxYJB0/edit)

##### Notes/Rationale
- Why RDBMS/SQL, and normalized data models?
  - Normalizing the data (separating campaigns and leads into different models, instead of storing leads as an array of email addresses inside each campaign) saves space for the most likely use-case of leads being sent multiple campaigns' emails
  - SQL is just easier to do analytics queries with
    - Queries like "What % of emails sent to lead XYZ were opened?" would be hard without SQL and normalization)
