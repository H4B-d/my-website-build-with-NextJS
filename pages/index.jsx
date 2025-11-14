// pages/index.jsx
import Header from "../src/components/Header";
import About from "../src/components/About";
import WeatherWidget from "../src/components/WeatherWidget";
import ExchangeWidget from "../src/components/ExchangeWidget";
import Projects from "../src/components/Projects";
import Contact from "../src/components/Contact";
import Footer from "../src/components/Footer";
import styles from "../src/App.module.css";

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <About />
        <section id="widgets" className={styles.widgetsSection}>
          <h2>💻 Widget</h2>
          <div className={styles.widgetsRow}>
            <div className={styles.widgetContainer}>
              <WeatherWidget />
            </div>
            <div className={styles.widgetContainer}>
              <ExchangeWidget />
            </div>
          </div>
        </section>
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
