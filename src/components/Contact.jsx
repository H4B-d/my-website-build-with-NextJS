// Contact.jsx
import styles from "./Contact.module.css";

export default function Contact() {
  const contacts = [
    {
      label: "Gmail",
      value: "habao25092004@gmail.com",
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=habao25092004@gmail.com",
    },
    { label: "GitHub", value: "H4B-d", href: "https://github.com/H4B-d" },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/ha-bao/",
      href: "https://www.linkedin.com/in/ha-bao/",
    },
  ];

  return (
    <section id="contact" className={styles.contactSection}>
      <h2>📫 Contact</h2>
      {contacts.map((c, idx) => (
        <p key={idx} className={styles.contactItem}>
          <strong>{c.label}:</strong>{" "}
          {c.href ? (
            <a href={c.href} target="_blank" rel="noreferrer">
              {c.value}
            </a>
          ) : (
            c.value
          )}
        </p>
      ))}
    </section>
  );
}




