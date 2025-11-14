import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLinks}>
          <a href="#about" className={styles.link}>About</a>
          <a href="#projects" className={styles.link}>Projects</a>
          <a href="#contact" className={styles.link}>Contact</a>
        </div>
        <p className={styles.copyRight}>
          © {new Date().getFullYear()} Ha Bao. All rights reserved.
        </p>
      </div>
    </footer>
  );
}



