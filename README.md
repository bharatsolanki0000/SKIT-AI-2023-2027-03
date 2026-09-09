# B.Tech Final Year Project - Weekly Progress Tracker

Welcome to the project repository for our B.Tech Computer Science and Engineering (Artificial Intelligence) final year project. 

This repository is configured with an automated GitHub Actions pipeline to track development activity and generate our mandatory Weekly Progress Reports (Form-3)[cite: 1].

## ⚙️ Automated Reporting Pipeline

To streamline evaluations, our performance and individual contributions are evaluated strictly based on verified commits pushed to this repository[cite: 1]. 

* **Automated Generation:** The GitHub Actions pipeline runs automatically every Thursday at 11:59 PM IST[cite: 1].
* **Metrics Tracked:** The script compiles code contributions, commit logs, active working days, and net lines of code (LOC)[cite: 1].
* **Output:** A standardized Form-3 PDF is generated and archived directly inside the `/weekly_reports` directory[cite: 1].

## 📋 Guidelines for Team Members

1. **Continuous Commits:** Work incrementally throughout the week[cite: 1]. Avoid pushing bulk code dumps at the deadline, as individual marks are tied to consistency and meaningful commit logs[cite: 1].
2. **Branching:** Work on individual branches and ensure your work is merged into the `main` branch before the Thursday deadline to be included in the weekly report[cite: 1].
3. **Weekly Submission:** Every week, download the latest compiled Form-3 PDF from the `/weekly_reports` folder and submit it to the Lab Coordinator/Project Mentor during the lab session[cite: 1].

## 📂 Key Files & Directories

* `generate_report.py`: The Python script responsible for analyzing git logs and rendering the Form-3 PDF[cite: 1].
* `.github/workflows/auto_weekly_report.yml`: The GitHub Actions workflow file that schedules and executes the automation[cite: 1].
* `/weekly_reports/`: The destination folder where all generated PDFs are permanently archived[cite: 1].

## 👥 Access & Evaluation

All team members, the Project Mentor, and the Lab Coordinator must have collaborator access to this repository to review code and access the generated reports[cite: 1].

---
*Developed by Bharat Solanki*