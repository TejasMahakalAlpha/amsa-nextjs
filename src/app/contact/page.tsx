

"use client";

import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram,
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope,
} from "react-icons/fa";
import styles from "./contact.module.css";

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "", message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'firstName' || name === 'lastName') {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === 'phone') {
      if (/^[0-9]*$/.test(value) && value.length <= 10) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required.";
    } else if (formData.firstName.trim().length < 2) {
        newErrors.firstName = "First name must be at least 2 characters.";
    }

    if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required.";
    } else if (formData.lastName.trim().length < 2) {
        newErrors.lastName = "Last name must be at least 2 characters.";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }
    if (!formData.message.trim()) {
        newErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
        newErrors.message = "Message must be at least 10 characters long.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Sending your message...");

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      toast.dismiss(toastId);

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again later.");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("An error occurred. Please try again later.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contactPageWrapper}>
      <Toaster position="top-right" reverseOrder={false} />
      <div className={styles.contactBackground}>
        <video autoPlay muted loop playsInline className={styles.contactVideo}>
          <source src="/video/bg3_Video.mp4" type="video/mp4" />
        </video>
        <div className={styles.contactOverlay}></div>
      </div>

      <main className={styles.contactContent}>
        <header className={styles.contactHeader}>
          <h1>Get In Touch</h1>
          <p>Have a project in mind or just want to say hello? We'd love to hear from you.</p>
        </header>

        <div className={styles.contactContainer}>
          <div className={styles.contactInfo}>
            <h2>Contact Information</h2>
            <p>Our team is available to answer your questions. Reach out to us through any of the channels below.</p>
            <ul className={styles.infoList}>
              <li><FaPhoneAlt /> <a href="tel:+917222029111">+91-7222029111</a></li>
              <li><FaEnvelope /> <a href="mailto:info@amsaoverseas.com">info@amsaoverseas.com</a></li>
              <li><FaMapMarkerAlt /> <span>Gera's Imperium Rise, Hinjewadi phase 2, Maharashtra 411057</span></li>
            </ul>
            <div className={styles.socialIcons}>
              {/* <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a> */}
              <a
                              href="https://www.instagram.com/amsa_overseas?igsh=MTFob3JpczJtYWowMg%3D%3D&utm_source=qr"
                              target="_blank"
                              rel="noreferrer"
                              aria-label="Instagram"
                            >
                              <FaInstagram />
                            </a>
              <a href="https://www.linkedin.com/company/amsa-overseas-private-ltd/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>
          </div>

          <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
          
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <input id="firstName" type="text" name="firstName" placeholder=" " value={formData.firstName} onChange={handleChange} required />
                <label htmlFor="firstName">First Name</label>
                {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
              </div>
              <div className={styles.formGroup}>
                <input id="lastName" type="text" name="lastName" placeholder=" " value={formData.lastName} onChange={handleChange} required />
                <label htmlFor="lastName">Last Name</label>
                {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
              </div>
            </div>
            <div className={styles.formGroup}>
              <input id="email" type="email" name="email" placeholder=" " value={formData.email} onChange={handleChange} required />
              <label htmlFor="email">Email Address</label>
              {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
            </div>
            <div className={styles.formGroup}>
              <input id="phone" type="tel" name="phone" placeholder=" " value={formData.phone} onChange={handleChange} />
              <label htmlFor="phone">Phone (Optional)</label>
              {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
            </div>
            <div className={styles.formGroup}>
              <textarea id="message" name="message" rows={5} placeholder=" " value={formData.message} onChange={handleChange} required></textarea>
              <label htmlFor="message">Your Message</label>
              {errors.message && <span className={styles.errorMessage}>{errors.message}</span>}
            </div>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <section className={styles.mapSection}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.502118515449!2d73.7184611!3d18.596472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bbb98e08c485%3A0x88605aadb7c213a6!2sGera&#39;s%20Imperium%20Rise!5e0!3m2!1sen!2sin!4v1756443565948!5m2!1sen!2sin"
            className={styles.mapIframe}
            allowFullScreen
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.502005996768!2d73.71588617465389!3d18.596477066852273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bbb98e08c485%3A0x88605aadb7c213a6!2sGera&#39;s%20Imperium%20Rise!5e0!3m2!1sen!2sin!4v1756395525974!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
        </section>
      </main>
    </div>
  );
}