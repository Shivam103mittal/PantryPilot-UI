import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Homepage = () => {
    const [currentIngredient, setCurrentIngredient] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const navigate = useNavigate();

    const ingredients = [
        { emoji: "🥕", name: "Carrots", amount: "3 pcs" },
        { emoji: "🍅", name: "Tomatoes", amount: "2 pcs" },
        { emoji: "🧄", name: "Garlic", amount: "400 g" },
        { emoji: "🧅", name: "Onions", amount: "1 pcs" },
        { emoji: "🥩", name: "Chicken", amount: "500g" }
    ];

    const recipes = [
        { name: "Mediterranean Chicken", time: "30 min", difficulty: "Easy" },
        { name: "Roasted Veggie Pasta", time: "25 min", difficulty: "Medium" },
        { name: "Garlic Herb Stir-fry", time: "20 min", difficulty: "Easy" }
    ];

    // Rotating ingredients animation
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIngredient((prev) => (prev + 1) % ingredients.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [ingredients.length]);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(prev => ({
                        ...prev,
                        [entry.target.id]: entry.isIntersecting
                    }));
                });
            },
            { threshold: 0.1 }
        );

        // Observe all sections
        const sections = document.querySelectorAll('[id^="section-"]');
        sections.forEach(section => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const handleGetStarted = () => navigate("/register");
    const handleLogin = () => navigate("/login");

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-20 left-40 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-50 p-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img src={logo} alt="PantryPilot Logo" className="w-12 h-12 rounded-xl shadow-lg" />
                        <span className="text-2xl font-bold text-white">Pantry Pilot</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleLogin}
                            className="text-white/80 hover:text-white transition-colors font-medium"
                        >
                            Login
                        </button>
                        <button
                            onClick={handleGetStarted}
                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="mb-8">
                        <div className="flex justify-center mb-10">
                            <img
                                src={logo}
                                alt="PantryPilot Logo"
                                className="w-28 h-28 md:w-36 md:h-36 rounded-3xl shadow-2xl"
                            />
                        </div>

                        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            Transform Your
                            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"> Ingredients</span>
                            <br />Into Magic
                        </h1>
                        <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
                            AI-powered recipe discovery that turns what's in your pantry into delicious meals.
                            No more wondering "what can I make with this?"
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={handleGetStarted}
                                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-xl"
                            >
                                Start Cooking Smart 🚀
                            </button>
                        </div>

                    </div>

                    {/* Interactive Demo */}
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                            <div className="grid md:grid-cols-3 gap-8 items-center">
                                {/* Input Side */}
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-white mb-4">Add Your Ingredients</h3>
                                    <div className="space-y-3">
                                        {ingredients.map((ingredient, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${index === currentIngredient
                                                    ? 'bg-gradient-to-r from-orange-500/30 to-red-500/30 border border-orange-400/50 scale-105'
                                                    : 'bg-white/5 border border-white/10'
                                                    }`}
                                            >
                                                <span className="text-2xl">{ingredient.emoji}</span>
                                                <div className="text-left">
                                                    <div className="text-white font-medium">{ingredient.name}</div>
                                                    <div className="text-white/60 text-sm">{ingredient.amount}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Arrow */}
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Output Side */}
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-bold text-white mb-4">Get Perfect Recipes</h3>
                                    <div className="space-y-3">
                                        {recipes.map((recipe, index) => (
                                            <div key={index} className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 p-4 rounded-xl">
                                                <div className="text-white font-semibold mb-1">{recipe.name}</div>
                                                <div className="flex gap-4 text-sm text-white/70">
                                                    <span>⏱️ {recipe.time}</span>
                                                    <span>👨‍🍳 {recipe.difficulty}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="section-features" className="relative z-10 pt-12 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-white mb-6">Why Pantry Pilot?</h2>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto">
                            Smart cooking starts with understanding what you have
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "⚡",
                                title: "Lightning Fast",
                                description: "Get instant recipes from our database or fresh AI-generated suggestions in seconds"
                            },
                            {
                                icon: "🧠",
                                title: "AI-Powered",
                                description: "Advanced algorithms analyze your ingredients and dietary preferences for perfect matches"
                            },
                            {
                                icon: "❤️",
                                title: "Save Favorites",
                                description: "Build your personal recipe collection by liking dishes you love for easy access later"
                            },
                            {
                                icon: "📱",
                                title: "Smart Input",
                                description: "Simply add ingredients with quantities and let our system do the heavy lifting"
                            },
                            {
                                icon: "🌍",
                                title: "Global Cuisine",
                                description: "Discover recipes from around the world that match your available ingredients"
                            },
                            {
                                icon: "💰",
                                title: "Reduce Waste",
                                description: "Make the most of what you have and reduce food waste with creative recipe suggestions"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className={`bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform ${isVisible['section-features'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                    }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-white/70 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="section-how" className="relative z-10 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-white mb-6">How It Works</h2>
                        <p className="text-xl text-white/70">Three simple steps to culinary magic</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "1",
                                title: "Add Ingredients",
                                description: "Tell us what you have in your pantry with quantities",
                                icon: "📝"
                            },
                            {
                                step: "2",
                                title: "Get AI Suggestions",
                                description: "Our AI analyzes your ingredients and suggests perfect recipes",
                                icon: "🤖"
                            },
                            {
                                step: "3",
                                title: "Start Cooking",
                                description: "Follow detailed recipes and save your favorites for later",
                                icon: "👨‍🍳"
                            }
                        ].map((step, index) => (
                            <div
                                key={index}
                                className={`text-center transform transition-all duration-500 ${isVisible['section-how'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                    }`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                            >
                                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg">
                                    {step.icon}
                                </div>
                                <div className="text-6xl font-bold text-white/20 mb-2">{step.step}</div>
                                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                                <p className="text-white/70 max-w-sm mx-auto leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="section-cta" className="relative z-10 py-24">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-lg p-12 rounded-3xl border border-orange-400/30">
                        <h2 className="text-5xl font-bold text-white mb-6">Ready to Transform Your Cooking?</h2>
                        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                            Join thousands of home cooks who've discovered the joy of cooking with what they have
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleGetStarted}
                                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-xl"
                            >
                                Start Your Culinary Journey 🍳
                            </button>
                            <button
                                onClick={handleLogin}
                                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
                            >
                                Already have an account?
                            </button>
                        </div>

                        <div className="mt-8 text-white/60 text-sm">
                            Free to start • No credit card required • Join in 30 seconds
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <img src={logo} alt="PantryPilot Logo" className="w-12 h-12 rounded-xl shadow-lg" />
                        <span className="text-lg font-bold text-white">Pantry Pilot</span>
                    </div>
                    <p className="text-white/60">Made with ❤️ for home cooks everywhere</p>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;