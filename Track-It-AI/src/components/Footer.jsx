import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Track-It AI. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
