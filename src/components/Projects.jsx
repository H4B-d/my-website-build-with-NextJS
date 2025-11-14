import React from "react";
import styles from "./Projects.module.css";

export default function Projects() {
  const projects = [
    {
      title: "California Housing Prices",
      description:
        "Analyze data and predictive modeling of housing prices using the California Housing Dataset.",
      tech: "Python, Pandas, Scikit-Learn, Matplotlib, Plotly, ...",
      link: "https://github.com/H4B-d/CA-Housing-Price-Prediction",
    },
    {
      title: "Detecting Fraudulent Transactions",
      description:
        "Performed analysis on transaction data and developed a machine learning model to detect fraudulent transactions.",
      tech: "Python, Pandas, Scikit-Learn, Matplotlib, Seaborn, ...",
      link: "https://github.com/H4B-d/Credit-Card-Fraud-Detection",
    },
  ];

  return (
    <section id="projects">
      <h2>🚀 My recent work</h2>
      <div className={styles.projectsGrid}>
        {projects.map((project, index) => (
          <div className={styles.projectCard} key={index}>
            <div className={styles.projectContent}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p>Tech used: {project.tech}</p>
              <a
                href={project.link}
                target="_blank"
                className={styles.btn}
                rel="noreferrer"
              >
                Source code
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}




