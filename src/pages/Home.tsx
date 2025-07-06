import React from 'react';
import { Link } from 'react-router-dom';
import { Hand, Waves, Video, Star, ArrowRight, Crown, Users, Target, Heart } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const Home: React.FC = () => {
  const { businesses, blogPosts, programs } = useAdmin();

  // Ensure programs are in the correct order: What's in Your Hand, Net in the Deep, The Boat
  const orderedPrograms = [
    programs.find(p => p.id === 'whats-in-your-hand'),
    programs.find(p => p.id === 'net-in-the-deep'),
    programs.find(p => p.id === 'the-boat')
  ].filter(Boolean);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ivory via-ivory to-mustard-yellow/10 py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-royal-blue/10 rounded-full mb-6 animate-float">
              <Crown className="w-8 h-8 text-royal-blue" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-playfair font-bold text-gray-900 mb-6 animate-slide-up">
              Launch or scale your{' '}
              <span className="text-royal-blue">God-given business</span>{' '}
              with confidence
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-inter max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Join a community of kingdom-minded entrepreneurs who build ventures rooted in God's vision 
              while thriving in the real world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link
                to="/register"
                className="bg-royal-blue text-white px-8 py-4 rounded-full font-inter font-semibold hover:bg-deep-blue transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Register Now
              </Link>
              <button
                onClick={() => {
                  const element = document.getElementById('programs');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="border-2 border-royal-blue text-royal-blue px-8 py-4 rounded-full font-inter font-semibold hover:bg-royal-blue hover:text-white transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 font-inter max-w-3xl mx-auto">
              Kingdom Business Studio bridges spirituality with entrepreneurship, offering teaching, 
              strategy, and biblical insight to help you build ventures that honor God and thrive in the marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-royal-blue/10 rounded-full mb-4">
                <Heart className="w-8 h-8 text-royal-blue" />
              </div>
              <h3 className="text-xl font-playfair font-semibold mb-3">Faith-Centered</h3>
              <p className="text-gray-600 font-inter">
                Every aspect of our programs is rooted in biblical principles and spiritual guidance.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-mustard-yellow/10 rounded-full mb-4">
                <Users className="w-8 h-8 text-mustard-yellow" />
              </div>
              <h3 className="text-xl font-playfair font-semibold mb-3">Community Driven</h3>
              <p className="text-gray-600 font-inter">
                Connect with like-minded entrepreneurs who share your values and vision.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-royal-blue/10 rounded-full mb-4">
                <Target className="w-8 h-8 text-royal-blue" />
              </div>
              <h3 className="text-xl font-playfair font-semibold mb-3">Results Focused</h3>
              <p className="text-gray-600 font-inter">
                Practical strategies and actionable insights to help your business succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-gray-900 mb-6">
              Our Programs
            </h2>
            <p className="text-xl text-gray-600 font-inter max-w-2xl mx-auto">
              Three distinct pathways to help you build, scale, and sustain your kingdom business.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {orderedPrograms.map((program, index) => {
              const icons = [Hand, Waves, Video];
              const Icon = icons[index] || Hand;
              const bgColor = program.primaryColor === 'royal-blue' ? 'bg-royal-blue' : 'bg-mustard-yellow';
              const accentColor = program.primaryColor === 'royal-blue' ? 'text-mustard-yellow' : 'text-royal-blue';
              
              return (
                <div key={program.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className={`${bgColor} p-6`}>
                    <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-playfair font-bold text-white mb-2">
                      {program.name}
                    </h3>
                    <p className="text-white/80 text-sm font-inter">
                      {program.id === 'whats-in-your-hand' && '8-Week Business Development Studio'}
                      {program.id === 'net-in-the-deep' && 'Advanced Scaling Program'}
                      {program.id === 'the-boat' && 'YouTube Channel'}
                    </p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 font-inter mb-6">
                      {program.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {program.features.slice(0, 3).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-600 font-inter">
                          <div className={`w-2 h-2 rounded-full mr-3 ${accentColor === 'text-mustard-yellow' ? 'bg-mustard-yellow' : 'bg-royal-blue'}`}></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {program.id === 'the-boat' ? (
                      <a
                        href="https://www.youtube.com/@THEBOATCREW"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center font-inter font-semibold transition-colors ${accentColor} hover:opacity-80`}
                      >
                        Watch Now <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    ) : (
                      <Link
                        to="/register"
                        className={`inline-flex items-center font-inter font-semibold transition-colors ${accentColor} hover:opacity-80`}
                      >
                        Learn More <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Current Businesses Section */}
      <section id="businesses" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-gray-900 mb-6">
              Current Businesses
            </h2>
            <p className="text-xl text-gray-600 font-inter max-w-2xl mx-auto">
              Meet our alumni and participating businesses who are thriving in their kingdom calling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businesses.slice(0, 6).map((business) => (
              <div key={business.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded border">
                    {business.logo.startsWith('data:') ? (
                      <img src={business.logo} alt={business.name} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <span className="text-2xl">{business.logo}</span>
                    )}
                  </div>
                  {business.isNew && (
                    <span className="bg-mustard-yellow text-white px-3 py-1 rounded-full text-sm font-inter font-medium">
                      New
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-2">
                  {business.name}
                </h3>
                <p className="text-royal-blue font-inter font-medium text-sm mb-3">
                  {business.category}
                </p>
                <p className="text-gray-600 font-inter">
                  {business.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-gray-900 mb-6">
              Latest Insights
            </h2>
            <p className="text-xl text-gray-600 font-inter max-w-2xl mx-auto">
              Christian business thought pieces, alumni journeys, and updates from the kingdom business community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {post.imageUrl && (
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-royal-blue/10 text-royal-blue px-3 py-1 rounded-full text-sm font-inter font-medium">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm font-inter">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-3">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 font-inter mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-inter">
                      By {post.author}
                    </span>
                    <Link 
                      to={`/blog/${post.id}`}
                      className="text-royal-blue font-inter font-medium hover:text-deep-blue transition-colors"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-royal-blue text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-playfair font-bold mb-6">
            Ready to Build Your Kingdom Business?
          </h2>
          <p className="text-xl mb-8 font-inter max-w-2xl mx-auto opacity-90">
            Join hundreds of kingdom-minded entrepreneurs who have transformed their God-given vision into thriving businesses.
          </p>
          <Link
            to="/register"
            className="bg-mustard-yellow text-white px-8 py-4 rounded-full font-inter font-semibold hover:bg-warm-yellow transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Your Journey Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;