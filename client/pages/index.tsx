import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// === Razorpay minimal helpers (safe, no SSR break) ===
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || ""; // test key id

const loadRazorpay = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false;
  if ((window as any).Razorpay) return true;
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
// === End Razorpay helpers ===

export default function Index() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
  });

  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  const [newsIndex, setNewsIndex] = useState(0);

  // New: extra projects tabs state
  const [activeWeek, setActiveWeek] = useState<number>(0);

  // Smooth scroll to the registration form (used by all CTAs)
  const scrollToRegister = () => {
    const el = document.getElementById("register");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // focus first field for better UX
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement | null;
      nameInput?.focus();
    }
  };

  // News ticker data
  const newsItems = [
    "🚀 Data Science jobs increased by 650% since 2012 - Harvard Business Review",
    "💰 Average Data Scientist salary: ₹12-25 LPA in India - PayScale",
    "📊 Data Analytics market expected to reach $77.6 billion by 2025 - Forbes",
    "🎯 Machine Learning engineers earn 40% more than average IT professionals",
    "🌟 LinkedIn ranked Data Scientist as #1 promising career for 3 consecutive years",
    "⚡ 90% of world's data was created in the last 2 years - IBM"
  ];

  // Auto-rotate news ticker
  useEffect(() => {
    const newsTimer = setInterval(() => {
      setNewsIndex(prev => (prev + 1) % newsItems.length);
    }, 4000);
    return () => clearInterval(newsTimer);
  }, [newsItems.length]);

  // Countdown timer (fixed)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { hours, minutes, seconds } = prev;
        if (hours === 0 && minutes === 0 && seconds === 0) return prev;

        if (seconds > 0) {
          return { ...prev, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { hours, minutes: minutes - 1, seconds: 59 };
        } else if (hours > 0) {
          return { hours: hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.state) {
      alert("Please fill all fields before payment.");
      return;
    }
    const ok = await loadRazorpay();
    if (!ok) {
      alert("Failed to load Razorpay. Check your network.");
      return;
    }
    const amountPaise = 49900; // ₹499 → 49900 paise
    const options: any = {
      key: RAZORPAY_KEY_ID,
      amount: amountPaise,
      currency: "INR",
      name: "Aicademi",
      description: "30 Days Internship - Machine Learning",
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      notes: { state: formData.state, program: "ML 30D" },
      theme: { color: "#f5c542" },
      handler: function (response: any) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
      },
      modal: { ondismiss: function () {} },
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", function (resp: any) {
      alert(resp.error?.description || "Payment failed. Please try again.");
    });
    rzp.open();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // === Your refined 30-day curriculum (already updated) ===
  const curriculumData = [
    // Week 1 - Foundation & Python Basics
    { day: 1, title: "What is AI & Machine Learning? Real-world applications & career paths", category: "introduction" },
    { day: 2, title: "Python Essentials for ML: Variables, Data Types, Loops, and Functions", category: "python" },
    { day: 3, title: "Working with Data: NumPy, Pandas, and Jupyter Notebook Basics", category: "python" },
    { day: 4, title: "Data Cleaning & Preprocessing: Handling Missing Values & Outliers", category: "data" },
    { day: 5, title: "Data Visualization using Matplotlib & Seaborn", category: "data" },
    { day: 6, title: "Mini Project 1 – Analyze & visualize Titanic dataset", category: "project", highlight: true },

    // Week 2 - Supervised Learning (Classification)
    { day: 7, title: "Understanding Supervised Learning: Classification vs Regression", category: "supervised" },
    { day: 8, title: "Logistic Regression: Predicting Customer Purchase Behavior", category: "supervised" },
    { day: 9, title: "K-Nearest Neighbors: Classify Iris Flower Species", category: "supervised" },
    { day: 10, title: "Naive Bayes: Spam vs Non-Spam Email Classifier", category: "supervised" },
    { day: 11, title: "Decision Tree: Predict Student Exam Results", category: "supervised" },
    { day: 12, title: "Random Forest: Credit Card Fraud Detection", category: "supervised" },
    { day: 13, title: "Model Evaluation: Accuracy, Precision, Recall, F1-Score", category: "evaluation" },
    { day: 14, title: "Mini Project 2 – Titanic Survival Prediction (End-to-End)", category: "project", highlight: true },

    // Week 3 - Supervised Learning (Regression)
    { day: 15, title: "Linear Regression: Predict House Prices (Single Feature)", category: "supervised" },
    { day: 16, title: "Multiple Linear Regression: Salary Prediction (Multi Features)", category: "supervised" },
    { day: 17, title: "Polynomial Regression: Predicting Car Prices", category: "supervised" },
    { day: 18, title: "Support Vector Regression: Stock Price Forecasting", category: "supervised" },
    { day: 19, title: "Regression Model Evaluation: RMSE, R² Score", category: "evaluation" },
    { day: 20, title: "Mini Project 3 – Predict Laptop Prices (Real Dataset)", category: "project", highlight: true },

    // Week 4 - Advanced ML (Unsupervised, RL, NLP)
    { day: 21, title: "Unsupervised Learning: Intro to Clustering & Dimensionality Reduction", category: "unsupervised" },
    { day: 22, title: "K-Means Clustering: Customer Segmentation", category: "unsupervised" },
    { day: 23, title: "Hierarchical Clustering: Market Segmentation", category: "unsupervised" },
    { day: 24, title: "PCA (Principal Component Analysis): Visualizing High-Dimensional Data", category: "unsupervised" },
    { day: 25, title: "Association Rule Mining: Market Basket Analysis (Apriori)", category: "unsupervised" },
    { day: 26, title: "Reinforcement Learning: Intro with Upper Confidence Bound (UCB)", category: "reinforcement" },
    { day: 27, title: "Natural Language Processing (NLP) Basics: Tokenization & Bag of Words", category: "nlp" },
    { day: 28, title: "Sentiment Analysis: Classify Movie Reviews (Positive/Negative)", category: "nlp" },
    { day: 29, title: "End-to-End Project: Build a Spam Email Classifier (NLP)", category: "project", highlight: true },
    { day: 30, title: "Capstone Project: Build Your Own ML Model & Present", category: "capstone", highlight: true },
  ];

  // === New: 4 extra real-life project weeks (tabs) ===
  const extraWeeks = [
    {
      title: "Week A — Customer Churn Prediction (Classification)",
      problem: "Predict whether a user will churn in the next 30 days using demographics, usage, and support tickets.",
      alignsWith: "Logistic Regression, KNN, Decision Tree, Random Forest, Model Metrics",
      datasets: ["Telco Customer Churn", "App retention logs", "CRM exports (anonymized)"],
      skills: ["EDA & feature engineering", "Imbalanced data handling (SMOTE)", "Model comparison", "Explainability (SHAP)"],
      deliverables: ["ROC/AUC report", "Top churn drivers", "Actionable retention playbook"],
    },
    {
      title: "Week B — Dynamic Pricing / Sales Forecasting (Regression)",
      problem: "Forecast weekly sales and simulate price elasticity to recommend best pricing.",
      alignsWith: "Linear/Multiple/Polynomial Regression, SVR, Regression metrics",
      datasets: ["Retail sales with price & promo", "Holiday calendar", "Competitor index"],
      skills: ["Feature creation (lags, rolling means)", "Cross-validation", "Error analysis"],
      deliverables: ["Price vs demand curves", "Forecast with confidence bands", "Pricing recommendations"],
    },
    {
      title: "Week C — Customer Segmentation + Market Basket (Unsupervised)",
      problem: "Group customers by behavior and mine item associations to improve cross-sell.",
      alignsWith: "K-Means, Hierarchical clustering, PCA, Apriori",
      datasets: ["Transactions (user, item, time, amount)", "Product taxonomy"],
      skills: ["Scaling & PCA", "Finding optimal K", "Association rules (support, confidence, lift)"],
      deliverables: ["Segment profiles", "Top bundles/combos", "Targeting plan per segment"],
    },
    {
      title: "Week D — NLP Support Insights + Ad UCB (NLP & RL)",
      problem: "Analyze sentiment/themes in support tickets and optimize ad choices using UCB.",
      alignsWith: "BoW/TF-IDF, Sentiment classification, Topic cues, UCB multi-armed bandit",
      datasets: ["Support tickets or app reviews", "Ad performance logs"],
      skills: ["Text preprocessing", "Model evaluation (F1)", "UCB exploration-exploitation"],
      deliverables: ["Theme & sentiment dashboard", "UCB lift vs baseline", "Playbook for next quarter"],
    },
  ];

  const bonusCourses = [
    { id: 1, title: "Every Saturday LIVE Sessions", subtitle: "Morning and Evening at 7:00 PM", description: "Interactive live sessions every Saturday to clear your doubts and get personalized guidance", features: ["Live Q&A Sessions", "Doubt Clearing", "Career Guidance", "Industry Insights"] },
    { id: 2, title: "30 Days Internship Assistance", subtitle: "Complete Support", description: "Comprehensive assistance throughout your 30-day internship journey", features: ["Project Guidance", "Resume Building", "Interview Preparation", "Portfolio Review"] },
    { id: 3, title: "Lifetime Private Community Access", subtitle: "Up to 3000+ Courses", description: "Access to exclusive private community with 3000+ courses in different topics", features: ["3000+ Courses", "Networking", "Job Opportunities", "Lifetime Access"] },
    { id: 4, title: "One To One Mentorship", subtitle: "Personalized Guidance", description: "Get personalized mentorship from industry experts to accelerate your learning", features: ["Expert Mentors", "Personalized Learning", "Career Guidance", "Flexible Schedule"] },
    { id: 5, title: "Lifetime Private Community Access", subtitle: "Up to 3000+ Courses", description: "Access to exclusive private community with 3000+ courses in different topics", features: ["3000+ Courses", "Networking", "Job Opportunities", "Lifetime Access"] }
  ];

  const testimonials = [
    { name: "Rahul Sharma", role: "Data Analyst at TCS", rating: 5, review: "This internship completely transformed my career. The practical approach and live projects helped me land a job at TCS within 2 months of completion!", image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg" },
    { name: "Priya Singh", role: "ML Engineer at Wipro", rating: 5, review: "Rajendra Mehta's teaching methodology is exceptional. The 30-day structured curriculum covered everything I needed to become job-ready in machine learning.", image: "https://images.pexels.com/photos/3831645/pexels-photo-3831645.jpeg" },
    { name: "Arjun Kumar", role: "Data Scientist at Infosys", rating: 5, review: "The hands-on projects and real-world applications made learning so much easier. Highly recommend this program for anyone serious about data science!", image: "https://images.pexels.com/photos/4195342/pexels-photo-4195342.jpeg" },
    { name: "Sneha Patel", role: "Business Analyst at Accenture", rating: 5, review: "The community support and lifetime access is incredible. Even after completing the internship, I continue to learn from the 3000+ additional courses.", image: "https://images.pexels.com/photos/3831849/pexels-photo-3831849.jpeg" }
  ];

  const targetAudience = [
    "Fresher", "Working in a company", "Students",
    "Professionals", "Faculty", "People with year gap",
    "Anyone who wants to master one of the most wanted & in-demand skill"
  ];

  const instructorStats = {
    followers: "8,000+",
    likes: "51,000+",
    reviews: "2,500+",
    students: "15,000+"
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* News Ticker */}
      <div className="bg-gradient-to-r from-gradient-pink-start to-gradient-pink-middle py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-white font-medium text-sm mx-8 animate-slide-left">
            {newsItems[newsIndex]}
          </span>
        </div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-32 right-20 w-40 h-40 bg-gradient-pink-start/10 rounded-full blur-3xl animate-pulse delay-75"></div>
          <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-gradient-pink-middle/10 rounded-full blur-3xl animate-pulse delay-150"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with animated tagline */}
        <div className="text-center mb-8 animate-fade-in">
          <p className="text-lg font-medium mb-4">
            <span className="tagline-pop bg-clip-text text-transparent bg-gradient-to-r from-gold via-white to-gradient-pink-middle">
              “Internship today, Data Scientist tomorrow.”
            </span>
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          {/* Left Side - Main Content */}
          <div className="space-y-8">
            {/* Main Title */}
            <div className="text-center lg:text-left animate-slide-in-left">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-4 hover:scale-105 transition-transform duration-500">
                <span className="text-white">30 Days Learning & 30 Days Internship</span><br />
                <span className="bg-gradient-to-r from-gradient-pink-start via-gradient-pink-middle to-gradient-pink-end bg-clip-text text-transparent animate-gradient">
                  Machine Learning
                </span>
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-gold text-xl font-semibold">
                <span className="hover:scale-110 transition-transform duration-300">With Internship E-Certificate</span>
                <div className="w-6 h-6 border-2 border-gold transform rotate-45 animate-spin-slow"></div>
              </div>
            </div>

            {/* Enhanced Instructor Profile */}
            <div className="flex flex-col items-center lg:items-start space-y-6 animate-slide-in-left delay-200">
              <div className="w-64 h-80 bg-gray-800 rounded-lg overflow-hidden shadow-2xl hover:shadow-gold/20 hover:scale-105 transition-all duration-500 group">
                <img
                  src="https://raw.githubusercontent.com/swapnil-mayavanshi/Website/main/serviehead.png"
                  alt="Rajendra Mehta - Product Manager & Data Scientist"
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-white mb-2 hover:text-gold transition-colors duration-300">Rajendra Mehta</h3>
                <p className="text-gray-300 text-lg hover:text-white transition-colors duration-300 mb-4">Head of Analytics (Gen AI, Agentic AI)</p>

                {/* Social Stats */}
                <div className="grid grid-cols-2 gap-4 max-w-xs">
                  <div className="text-center p-3 bg-gradient-to-r from-gradient-pink-start/10 to-gradient-pink-middle/10 rounded-lg border border-gradient-pink-start/20 hover:border-gradient-pink-start/50 transition-all duration-300">
                    <div className="text-xl font-bold text-gradient-pink-start">{instructorStats.followers}</div>
                    <div className="text-xs text-gray-400">Followers</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-gradient-pink-start/10 to-gradient-pink-middle/10 rounded-lg border border-gradient-pink-start/20 hover:border-gradient-pink-start/50 transition-all duration-300">
                    <div className="text-xl font-bold text-gradient-pink-start">{instructorStats.likes}</div>
                    <div className="text-xs text-gray-400">Likes</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-gradient-pink-start/10 to-gradient-pink-middle/10 rounded-lg border border-gradient-pink-start/20 hover:border-gradient-pink-start/50 transition-all duration-300">
                    <div className="text-xl font-bold text-gradient-pink-start">{instructorStats.reviews}</div>
                    <div className="text-xs text-gray-400">Reviews</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-gradient-pink-start/10 to-gradient-pink-middle/10 rounded-lg border border-gradient-pink-start/20 hover:border-gradient-pink-start/50 transition-all duration-300">
                    <div className="text-xl font-bold text-gradient-pink-start">{instructorStats.students}</div>
                    <div className="text-xs text-gray-400">Students</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature bullets */}
            <div className="space-y-4 animate-slide-in-left delay-300">
              {[
                { icon: "📋", title: "Complete Recordings of 30 Days With Materials" },
                { icon: "🎓", title: "Internship Certification" },
                { icon: "📺", title: "Unlimited Every Saturday Live Session" },
                { icon: "👥", title: "Lifetime Private Community Access" },
                { icon: "⚡", title: "Lifetime Course Validity" }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="border border-gradient-pink-start/30 rounded-lg p-4 bg-gradient-to-r from-gradient-pink-start/5 to-transparent hover:from-gradient-pink-start/10 hover:border-gradient-pink-start/50 transition-all duration-500 hover:scale-105 hover:shadow-lg cursor-pointer transform"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gradient-pink-start to-gradient-pink-middle rounded-lg flex items-center justify-center text-xl hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <span className="text-white font-medium hover:text-gold transition-colors duration-300">{feature.title}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* New: CTA that jumps to form */}
            <div className="text-center lg:text-left">
              <Button onClick={scrollToRegister} className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-gradient-pink-start via-gradient-pink-middle to-gradient-pink-end hover:from-gradient-pink-middle hover:to-gradient-pink-end text-white rounded-full transition-all duration-500 hover:scale-110 hover:shadow-2xl animate-bounce">
                ≫ YES, I Want to Master Machine Learning
                <div className="text-sm mt-1">JOIN THE INTERNSHIP FOR JUST ₹499 <span className="line-through text-gray-200">₹1499</span></div>
              </Button>
            </div>
          </div>

          {/* Right Side - Registration Form (primary Razorpay) */}
          <div className="lg:sticky lg:top-8 animate-slide-in-right" id="register">
            <Card className="p-6 bg-gradient-to-br from-gray-900 to-black border-2 border-gold/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 backdrop-blur-lg">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gold rounded-full animate-pulse"></div>
                  <span className="text-2xl font-bold text-white">30 Days</span>
                  <span className="text-gold font-bold text-xl animate-bounce">INTERNSHIP</span>
                </div>
                <p className="text-gold font-semibold">On Data Analytics</p>

                {/* Countdown Timer */}
                <div className="mt-4 mb-4">
                  <div className="flex justify-center gap-4 text-3xl font-bold text-red-500">
                    <div className="text-center">
                      <div className="animate-pulse">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="text-xs text-gold">HRS</div>
                    </div>
                    <div className="text-center">
                      <div className="animate-pulse">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="text-xs text-gold">MIN</div>
                    </div>
                    <div className="text-center">
                      <div className="animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="text-xs text-gold">SEC</div>
                    </div>
                  </div>
                  <p className="text-sm text-red-500 mt-2 animate-bounce">* Wait Till End to Get Your BONUS *</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <Input type="text" name="name" placeholder="Full Name*" value={formData.name} onChange={handleInputChange} className="h-12 bg-gray-800/80 border-2 border-gold/50 text-white placeholder-gray-400 focus:border-gold hover:border-gold/70 transition-colors duration-300 font-medium" required />
                </div>

                <div className="transform hover:scale-105 transition-transform duration-300">
                  <Input type="email" name="email" placeholder="Email*" value={formData.email} onChange={handleInputChange} className="h-12 bg-gray-800/80 border-2 border-gold/50 text-white placeholder-gray-400 focus:border-gold hover:border-gold/70 transition-colors duration-300 font-medium" required />
                </div>

                <div className="transform hover:scale-105 transition-transform duration-300">
                  <Input type="tel" name="phone" placeholder="Phone*" value={formData.phone} onChange={handleInputChange} className="h-12 bg-gray-800/80 border-2 border-gold/50 text-white placeholder-gray-400 focus:border-gold hover:border-gold/70 transition-colors duration-300 font-medium" required />
                </div>

                <div className="transform hover:scale-105 transition-transform duration-300">
                  <Input type="text" name="state" placeholder="State*" value={formData.state} onChange={handleInputChange} className="h-12 bg-gray-800/80 border-2 border-gold/50 text-white placeholder-gray-400 focus:border-gold hover:border-gold/70 transition-colors duration-300 font-medium" required />
                </div>

                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-gold via-gold to-gradient-pink-start hover:from-gradient-pink-start hover:to-gold text-black font-semibold text-lg transition-all duration-500 transform hover:scale-105 hover:shadow-lg animate-pulse">
                  Yes! Register Now
                </Button>

                <div className="text-center text-sm text-gold mt-4">
                  <p>🔒 Your information is secure with us</p>
                </div>
              </form>
            </Card>
          </div>
        </div>

        {/* Who is this Program for? Section */}
        <section className="mt-20 animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-white">Who is this </span>
              <span className="bg-gradient-to-r from-gradient-pink-start via-gradient-pink-middle to-gradient-pink-end bg-clip-text text-transparent">Program for ?</span>
            </h2>
            <p className="text-gray-300 text-lg">who wants to opens doors to new possibilities in different fields</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto mb-12">
            {targetAudience.slice(0, -1).map((audience, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:border-gradient-pink-start/50 hover:bg-gradient-pink-start/10 transition-all duration-500 hover:scale-105 cursor-pointer transform"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-6 h-6 bg-gradient-pink-start rounded-full flex-shrink-0 animate-pulse"></div>
                <span className="text-white font-medium">{audience}</span>
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:border-gradient-pink-start/50 hover:bg-gradient-pink-start/10 transition-all duration-500 hover:scale-105 cursor-pointer transform max-w-2xl mx-auto">
              <div className="w-6 h-6 bg-gradient-pink-start rounded-full flex-shrink-0 animate-pulse"></div>
              <span className="text-white font-medium">{targetAudience[targetAudience.length - 1]}</span>
            </div>
          </div>

          <div className="text-center">
            <Button onClick={scrollToRegister} className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-gradient-pink-start via-gradient-pink-middle to-gradient-pink-end hover:from-gradient-pink-middle hover:to-gradient-pink-end text-white rounded-full transition-all duration-500 hover:scale-110 hover:shadow-2xl animate-bounce">
              ≫ YES, I Want to Master Machine Learning
              <div className="text-sm mt-1">JOIN THE INTERNSHIP FOR JUST ₹499 <span className="line-through text-gray-200">₹1499</span></div>
            </Button>
            <p className="mt-4 text-white font-semibold">Take Action Now!!!</p>
          </div>
        </section>

        {/* What You will learn Section */}
        <section className="mt-20 animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-white">What You will </span>
              <span className="bg-gradient-to-r from-gradient-pink-start via-gradient-pink-middle to-gradient-pink-end bg-clip-text text-transparent">learn in this program ?</span>
            </h2>
            <p className="text-gold text-lg font-semibold">30 Day Challenge - to become Zero to 🚀🚀🚀🚀 as Machine Learning</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {curriculumData.map((item, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-all duration-500 hover:scale-105 cursor-pointer transform ${
                  item.highlight
                    ? 'bg-gradient-to-r from-gradient-pink-start/20 to-gradient-pink-middle/20 border-gradient-pink-start/50 hover:border-gradient-pink-start'
                    : 'bg-white/5 border-white/10 hover:border-gradient-pink-start/30 hover:bg-white/10'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm ${
                  item.highlight ? 'bg-gradient-pink-start text-white animate-pulse' : 'bg-gradient-pink-start text-white'
                }`}>
                  {item.day}
                </div>
                <div className="flex-1">
                  {item.highlight && (
                    <Badge className="mb-2 bg-gradient-to-r from-gradient-pink-start to-gradient-pink-middle text-white border-0 hover:scale-110 transition-transform duration-300">
                      MILESTONE
                    </Badge>
                  )}
                  <p className="text-white font-medium hover:text-gold transition-colors duration-300">
                    <span className="font-bold">Day-{item.day}:</span> {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button onClick={scrollToRegister} className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-gradient-pink-start via-gradient-pink-middle to-gradient-pink-end hover:from-gradient-pink-middle hover:to-gradient-pink-end text-white rounded-full transition-all duration-500 hover:scale-110 hover:shadow-2xl animate-pulse">
              ≫ REGISTER FOR 30 DAYS INTERNSHIP
            </Button>
          </div>
        </section>

        {/* NEW: 4 Extra Real-Life Project Weeks (Tabs) */}
        <section className="mt-20 animate-fade-in-up" id="extra-projects">
          <div className="text-center mb-10">
            <h2 className="text-4xl lg:text-5xl font-bold mb-3">
              <span className="bg-gradient-to-r from-gold via-gradient-pink-middle to-gradient-pink-end bg-clip-text text-transparent">
                4 Weeks of Real-World ML Projects
              </span>
            </h2>
            <p className="text-gray-300 text-lg">Practice what you learned with job-ready, business-focused projects.</p>
          </div>

          {/* Tabs */}
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {extraWeeks.map((w, i) => (
                <button
                  key={i}
                  onClick={() => setActiveWeek(i)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    activeWeek === i
                      ? "border-gold bg-gold text-black font-semibold scale-105"
                      : "border-white/20 text-white hover:border-gold hover:scale-105"
                  }`}
                >
                  {w.title.split(" — ")[0]}
                </button>
              ))}
            </div>

            {/* Content */}
            <Card className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-white/15">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{extraWeeks[activeWeek].title}</h3>
                  <p className="text-gold font-medium mb-4">{extraWeeks[activeWeek].problem}</p>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p><span className="text-white font-semibold">Aligned With: </span>{extraWeeks[activeWeek].alignsWith}</p>
                    <p><span className="text-white font-semibold">Datasets: </span>{extraWeeks[activeWeek].datasets.join(", ")}</p>
                    <p><span className="text-white font-semibold">Skills: </span>{extraWeeks[activeWeek].skills.join(", ")}</p>
                    <p><span className="text-white font-semibold">Deliverables: </span>{extraWeeks[activeWeek].deliverables.join(", ")}</p>
                  </div>
                </div>
                <div className="flex flex-col items-start justify-between">
                  <ul className="list-disc list-inside text-white/90 space-y-2">
                    <li>Clean & explore dataset; define success metrics.</li>
                    <li>Build baseline model; iterate & compare.</li>
                    <li>Explain results; outline next business actions.</li>
                  </ul>
                  <Button onClick={scrollToRegister} className="mt-6 px-6 py-3 font-semibold bg-gradient-to-r from-gold to-gradient-pink-start text-black hover:opacity-90 transition-all">
                    Build this project (Join @ ₹499)
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Personal Instructor Section - ABOUT ME */}
        <section className="mt-20 animate-fade-in-up" id="about-me">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Meet Your </span>
              <span className="bg-gradient-to-r from-gradient-pink-start via-gradient-pink-middle to-gradient-pink-end bg-clip-text text-transparent">Instructor</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gradient-pink-start to-gradient-pink-middle mx-auto mb-4 animate-expand"></div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Industry expert with years of experience helping students transform their careers</p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl border border-white/20 hover:border-gradient-pink-start/50 transition-all duration-700 group">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-pink-start rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold rounded-full blur-3xl animate-float-delayed"></div>
              </div>

              <div className="relative p-12 lg:p-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  {/* Left Side - Photo & Stats */}
                  <div className="text-center lg:text-left space-y-8">
                    <div className="relative group inline-block">
                      <div className="w-80 h-96 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 hover:border-gradient-pink-start/50 transition-all duration-700 hover:scale-105 hover:rotate-1 group-hover:shadow-gradient-pink-start/20">
                        <img
                          src="https://raw.githubusercontent.com/swapnil-mayavanshi/Website/main/aboutImage.png"
                          alt="Professional Instructor Photo"
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>

                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-pink-start rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        <span className="text-white text-xl font-bold">✓</span>
                      </div>
                      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <span className="text-black text-2xl font-bold">★</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto lg:mx-0">
                      <div className="bg-gradient-to-br from-gradient-pink-start/20 to-gradient-pink-start/5 rounded-xl p-4 border border-gradient-pink-start/30 hover:border-gradient-pink-start/60 transition-all duration-500 hover:scale-105 cursor-pointer group">
                        <div className="text-3xl font-bold text-gradient-pink-start mb-1 group-hover:scale-110 transition-transform duration-300">20+</div>
                        <div className="text-white text-sm font-medium">Years Experience</div>
                      </div>
                      <div className="bg-gradient-to-br from-gold/20 to-gold/5 rounded-xl p-4 border border-gold/30 hover:border-gold/60 transition-all duration-500 hover:scale-105 cursor-pointer group">
                        <div className="text-3xl font-bold text-gold mb-1 group-hover:scale-110 transition-transform duration-300">15K+</div>
                        <div className="text-white text-sm font-medium">Students Trained</div>
                      </div>
                      <div className="bg-gradient-to-br from-gradient-pink-middle/20 to-gradient-pink-middle/5 rounded-xl p-4 border border-gradient-pink-middle/30 hover:border-gradient-pink-middle/60 transition-all duration-500 hover:scale-105 cursor-pointer group">
                        <div className="text-3xl font-bold text-gradient-pink-middle mb-1 group-hover:scale-110 transition-transform duration-300">300+</div>
                        <div className="text-white text-sm font-medium">Projects</div>
                      </div>
                      <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 cursor-pointer group">
                        <div className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">98%</div>
                        <div className="text-white text-sm font-medium">Success Rate</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Info */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-4xl lg:text-5xl font-bold text-white hover:text-gradient-pink-start transition-colors duration-500 cursor-pointer">
                        Rajendra Mehta
                      </h3>
                      <p className="text-xl text-gray-300 font-medium hover:text-white transition-colors duration-300">
                        Product Manager & Data Science Expert
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-4 py-2 bg-gradient-to-r from-gradient-pink-start to-gradient-pink-middle text-white text-sm font-semibold rounded-full">Machine Learning Expert</span>
                        <span className="px-4 py-2 bg-gradient-to-r from-gold/80 to-gold text-black text-sm font-semibold rounded-full">International Experience</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 bg-gradient-to-r from-white/10 to-transparent rounded-xl border-l-4 border-gradient-pink-start hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] cursor-pointer group">
                        <h4 className="text-lg font-bold text-gradient-pink-start mb-3 group-hover:text-gradient-pink-middle transition-colors duration-300">Professional Background</h4>
                        <p className="text-gray-200 leading-relaxed">
                          With over 20 years of experience in Big Data Management and Machine Learning, I specialize in helping businesses and students master data-driven technologies. My expertise spans across Python programming, advanced analytics, and AI implementation.
                        </p>
                      </div>

                      <div className="p-6 bg-gradient-to-r from-gold/10 to-transparent rounded-xl border-l-4 border-gold hover:bg-gold/15 transition-all duration-500 hover:scale-[1.02] cursor-pointer group">
                        <h4 className="text-lg font-bold text-gold mb-3 group-hover:text-gradient-pink-start transition-colors duration-300">Global Experience</h4>
                        <p className="text-gray-200 leading-relaxed">
                          International experience across Netherlands, Denmark, and India, working with Fortune 500 companies on cutting-edge data science projects and machine learning implementations.
                        </p>
                      </div>

                      <div className="p-6 bg-gradient-to-r from-gradient-pink-middle/10 to-transparent rounded-xl border-l-4 border-gradient-pink-middle hover:bg-gradient-pink-middle/15 transition-all duration-500 hover:scale-[1.02] cursor-pointer group">
                        <h4 className="text-lg font-bold text-gradient-pink-middle mb-3 group-hover:text-gold transition-colors duration-300">Teaching Philosophy</h4>
                        <p className="text-gray-200 leading-relaxed">
                          I believe in practical, project-based learning that prepares students for real-world challenges. My approach focuses on building strong fundamentals while working on industry-relevant projects.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-white">Core Expertise</h4>
                      <div className="flex flex-wrap gap-3">
                        {['Gen Ai','Agentic Ai','LLM','Machine Learning','Python','Big Data','Data Science','AI/Deep Learning','Project Management'].map((name, index) => (
                          <div key={index} className="group relative bg-gradient-to-r from-white/10 to-white/5 rounded-lg px-4 py-2 border border-white/20 hover:border-gradient-pink-start/50 transition-all duration-500 hover:scale-110 cursor-pointer">
                            <span className="text-white font-medium">{name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-gradient-pink-start/10 to-transparent rounded-lg p-4 border border-gradient-pink-start/30 hover:border-gradient-pink-start/60 transition-all duration-500 hover:scale-105">
                        <div className="text-gradient-pink-start font-bold mb-2">Industry Recognition</div>
                        <div className="text-gray-300 text-sm">Top 1% Data Science Mentor on LinkedIn</div>
                      </div>
                      <div className="bg-gradient-to-br from-gold/10 to-transparent rounded-lg p-4 border border-gold/30 hover:border-gold/60 transition-all duration-500 hover:scale-105">
                        <div className="text-gold font-bold mb-2">Published Author</div>
                        <div className="text-gray-300 text-sm">15+ Research Papers in AI/ML</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                  <div className="relative overflow-hidden bg-gradient-to-r from-gradient-pink-start/20 via-gold/10 to-gradient-pink-middle/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-gradient-pink-start/50 transition-all duration-700 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-gradient-pink-start/10 to-gold/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <div className="relative">
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gradient-pink-start transition-colors duration-500">Ready to Transform Your Career?</h3>
                      <p className="text-gray-300 mb-6 max-w-2xl mx-auto">Join thousands of successful students who have launched their data science careers with personalized mentorship and industry-proven curriculum.</p>
                      <Button onClick={scrollToRegister} className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-gradient-pink-start via-gradient-pink-middle to-gradient-pink-end hover:from-gradient-pink-middle hover:to-gradient-pink-end text-white rounded-full transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-gradient-pink-start/30 transform group-hover:animate-pulse">
                        Start Learning With Me - ₹499 Only
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bonus Courses Section */}
        <section className="mt-20 animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gold via-gradient-pink-middle to-gradient-pink-end bg-clip-text text-transparent">EXCLUSIVE BONUS</span>
            </h2>
            <p className="text-white text-lg font-medium">Get these amazing bonuses absolutely FREE with your internship</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {bonusCourses.map((bonus) => (
              <Card
                key={bonus.id}
                className="p-6 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-gold/50 hover:border-gold transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gold/30 transform"
              >
                <div className="text-center mb-4">
                  <Badge className="bg-gold text-black font-bold px-4 py-2 text-lg mb-3 hover:scale-110 transition-transform duration-300">
                    BONUS #{bonus.id}
                  </Badge>
                  <h3 className="text-xl font-bold text-white mb-2">{bonus.title}</h3>
                  <p className="text-gold font-semibold">{bonus.subtitle}</p>
                </div>

                <p className="text-white text-sm mb-4 text-center font-medium">{bonus.description}</p>

                <div className="space-y-2">
                  {bonus.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 bg-gold rounded-full flex-shrink-0 animate-pulse"></div>
                      <span className="text-white font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <div className="text-2xl font-bold text-gold">FREE</div>
                  <div className="text-sm text-white font-medium">Worth ₹2999 each</div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mt-20 animate-fade-in-up">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-white">What Our </span>
              <span className="text-gold">Students Say</span>
            </h2>
            <p className="text-white text-lg font-semibold">Real success stories from our amazing students</p>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-gradient-pink-start mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gold/50 hover:border-gold hover:shadow-2xl hover:shadow-gold/20 transition-all duration-500 hover:scale-105 transform">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gold"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg mb-1">{testimonial.name}</h4>
                    <p className="text-gold font-semibold text-sm mb-2">{testimonial.role}</p>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-gold text-lg">⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-white text-sm leading-relaxed font-medium">"{testimonial.review}"</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button onClick={scrollToRegister} className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-gradient-pink-start via-gradient-pink-middle to-gradient-pink-end hover:from-gradient-pink-middle hover:to-gradient-pink-end text-white rounded-full transition-all duration-500 hover:scale-110 hover:shadow-2xl animate-pulse">
              Join 10,000+ Successful Students - Enroll Now for ₹499!
            </Button>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-left {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(2deg); }
          66% { transform: translateY(-20px) rotate(-1deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(-2deg); }
          66% { transform: translateY(-30px) rotate(1deg); }
        }

        @keyframes expand {
          0% { width: 0; }
          100% { width: 6rem; }
        }

        /* NEW: Tagline attention animation */
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 10px rgba(255,215,0,0.25), 0 0 20px rgba(255,105,180,0.15); transform: translateY(0) scale(1); }
          50% { text-shadow: 0 0 18px rgba(255,215,0,0.45), 0 0 28px rgba(255,105,180,0.35); transform: translateY(-2px) scale(1.02); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .tagline-pop {
          display: inline-block;
          animation: glow 2.2s ease-in-out infinite;
          background-size: 300% 100%;
          animation-name: glow, shimmer;
          animation-duration: 2.2s, 3.5s;
          animation-iteration-count: infinite, infinite;
          animation-timing-function: ease-in-out, linear;
          padding: 0.2rem 0.4rem;
          border-radius: 0.5rem;
        }

        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 1s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 1s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
        .animate-marquee { animation: marquee 20s linear infinite; }
        .animate-slide-left { animation: slide-left 20s linear infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 6s ease-in-out infinite; animation-delay: -3s; }
        .animate-expand { animation: expand 2s ease-out; }

        .delay-75 { animation-delay: 75ms; }
        .delay-150 { animation-delay: 150ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>
    </div>
  );
}
