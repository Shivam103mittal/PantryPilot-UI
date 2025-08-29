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
            {/* Fixed animated background for iOS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-72 h-72 sm:w-96 sm:h-96 bg-purple-400 rounded-full opacity-20 animate-pulse" style={{ filter: 'blur(40px)', mixBlendMode: 'multiply' }}></div>
                <div className="absolute top-40 right-20 w-72 h-72 sm:w-96 sm:h-96 bg-yellow-400 rounded-full opacity-20 animate-pulse" style={{ filter: 'blur(40px)', mixBlendMode: 'multiply', animationDelay: '2s' }}></div>
                <div className="absolute bottom-20 left-40 w-72 h-72 sm:w-96 sm:h-96 bg-pink-400 rounded-full opacity-20 animate-pulse" style={{ filter: 'blur(40px)', mixBlendMode: 'multiply', animationDelay: '4s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-50 p-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img src={logo} alt="PantryPilot Logo" className="w-12 h-12 rounded-xl shadow-lg" />
                        <span className="text-2xl font-bold text-white" style={{ color: '#ffffff' }}>Pantry Pilot</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleLogin}
                            className="font-medium transition-colors"
                            style={{ color: 'rgba(255, 255, 255, 0.8)' }}
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

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            <span style={{ color: '#ffffff' }}>Transform Your</span>
                            <br />
                            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Ingredients</span>
                            <br />
                            <span style={{ color: '#ffffff' }}>Into Magic</span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
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
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                            <div className="grid md:grid-cols-3 gap-8 items-center">
                                {/* Input Side */}
                                <div className="space-y-6">
                                    <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>Add Your Ingredients</h3>
                                    <div className="space-y-3">
                                        {ingredients.map((ingredient, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${index === currentIngredient
                                                    ? 'border scale-105'
                                                    : 'border'
                                                    }`}
                                                style={{
                                                    backgroundColor: index === currentIngredient 
                                                        ? 'rgba(249, 115, 22, 0.3)' 
                                                        : 'rgba(255, 255, 255, 0.05)',
                                                    borderColor: index === currentIngredient 
                                                        ? 'rgba(249, 115, 22, 0.5)' 
                                                        : 'rgba(255, 255, 255, 0.1)'
                                                }}
                                            >
                                                <span className="text-2xl">{ingredient.emoji}</span>
                                                <div className="text-left">
                                                    <div className="font-medium" style={{ color: '#ffffff' }}>{ingredient.name}</div>
                                                    <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{ingredient.amount}</div>
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
                                    <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>Get Perfect Recipes</h3>
                                    <div className="space-y-3">
                                        {recipes.map((recipe, index) => (
                                            <div 
                                                key={index} 
                                                className="p-4 rounded-xl border"
                                                style={{
                                                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                                                    borderColor: 'rgba(34, 197, 94, 0.3)'
                                                }}
                                            >
                                                <div className="font-semibold mb-1" style={{ color: '#ffffff' }}>{recipe.name}</div>
                                                <div className="flex gap-4 text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#ffffff' }}>Why Pantry Pilot?</h2>
                        <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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
                                className={`p-8 rounded-2xl border hover:bg-white/20 transition-all duration-500 transform ${isVisible['section-features'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                    }`}
                                style={{ 
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(16px)',
                                    transitionDelay: `${index * 100}ms`
                                }}
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>{feature.title}</h3>
                                <p className="leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="section-how" className="relative z-10 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#ffffff' }}>How It Works</h2>
                        <p className="text-lg sm:text-xl" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Three simple steps to culinary magic</p>
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
                                <div className="text-6xl font-bold mb-2" style={{ color: 'rgba(255, 255, 255, 0.2)' }}>{step.step}</div>
                                <h3 className="text-2xl font-bold mb-4" style={{ color: '#ffffff' }}>{step.title}</h3>
                                <p className="max-w-sm mx-auto leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="section-cta" className="relative z-10 py-24">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div 
                        className="p-8 sm:p-12 rounded-3xl border"
                        style={{
                            backgroundColor: 'rgba(249, 115, 22, 0.2)',
                            borderColor: 'rgba(249, 115, 22, 0.3)',
                            backdropFilter: 'blur(16px)'
                        }}
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#ffffff' }}>Ready to Transform Your Cooking?</h2>
                        <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
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
                                className="border text-white px-8 py-4 rounded-xl font-semibold transition-all"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(8px)'
                                }}
                            >
                                Already have an account?
                            </button>
                        </div>

                        <div className="mt-8 text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            Free to start • No credit card required • Join in 30 seconds
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <img src={logo} alt="PantryPilot Logo" className="w-12 h-12 rounded-xl shadow-lg" />
                        <span className="text-lg font-bold" style={{ color: '#ffffff' }}>Pantry Pilot</span>
                    </div>
                    <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Made with ❤️ for home cooks everywhere</p>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;