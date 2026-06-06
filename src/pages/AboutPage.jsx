import React from 'react';

const AboutPage = () => {
  const timeline = [
    { year: "1988", event: "Makoo Bakery founded in Jawalakhel, Lalitpur" },
    { year: "1995", event: "Expanded product range to include custom celebration cakes" },
    { year: "2005", event: "Became Lalitpur's premier wedding cake specialist" },
    { year: "2015", event: "Opened second branch in Talchikhel" },
    { year: "2020", event: "Launched online ordering and cake pre-order service" },
    { year: "2025", event: "Celebrating 37 years of baking heritage" },
  ];

  const values = [
    { title: "Family-Run", desc: "Every decision is made with family values. Quality over shortcuts, always." },
    { title: "Daily Fresh", desc: "Nothing sits on our shelves overnight. Fresh bakes arrive every morning." },
    { title: "Community First", desc: "We have served Jawalakhel's community for over 35 years and counting." },
  ];

  const team = [
    { role: "Baker / Founder", desc: "Family Head, Est. 1988", image: "/images/baker-portrait.jpg" },
    { role: "Head Pastry Chef", desc: "Master of croissants & cakes", image: "/images/baker-portrait.jpg" },
    { role: "Wedding Cake Designer", desc: "Bringing visions to life", image: "/images/baker-portrait.jpg" },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="bg-navy-dark py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="text-gold text-xs tracking-[0.15em]">OUR STORY</div>
          <h1 className="font-display text-[72px] text-cream tracking-[-1.5px] leading-none mt-1">Baking Heritage Since 1988</h1>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <img src="/images/bakery-interior.jpg" alt="Bakery Interior" className="w-full border border-navy/10" />
          </div>
          <div className="pt-2">
            <div className="text-gold text-xs tracking-[0.2em] font-medium mb-3">WHO WE ARE</div>
            <h2 className="font-display text-[48px] leading-none text-navy tracking-tight mb-7">A Lalitpur Institution</h2>
            
            <div className="space-y-5 text-[15px] text-navy/80 leading-relaxed">
              <p>Makoo Bakery was founded in 1988 in the heart of Jawalakhel, Lalitpur. What began as a small family venture has grown to become one of Nepal's most beloved bakeries — a name trusted by generations of families across the Kathmandu Valley.</p>
              <p>We specialize in custom wedding cakes, celebration cakes, and fresh-baked goods produced daily. Our recipes have been refined over 35 years, balancing classic Nepali tastes with international baking techniques.</p>
              <p>Today we operate two locations — our flagship store in Jawalakhel and our Talchikhel branch — serving hundreds of customers every day. But we remain, at heart, a family bakery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-navy py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <div key={i} className="bg-cream p-8 text-navy">
                <div className="text-gold text-xs tracking-[0.2em] mb-2">{(i+1).toString().padStart(2, '0')}</div>
                <h4 className="font-display text-3xl tracking-tight mb-3">{v.title}</h4>
                <p className="text-sm text-navy/70 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-cream">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="font-display text-center text-4xl text-navy tracking-tight mb-12">Our Journey</h3>
          
          <div className="relative">
            <div className="absolute left-[21px] top-0 bottom-0 w-[1px] bg-navy/20" />
            
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-8 mb-9 last:mb-0 relative">
                <div className="w-11 h-11 rounded-full bg-navy flex-shrink-0 flex items-center justify-center text-cream text-sm font-medium z-10 border-4 border-cream">
                  {item.year.slice(-2)}
                </div>
                <div className="pt-1.5">
                  <div className="font-display text-2xl text-navy tracking-tight">{item.year}</div>
                  <p className="text-navy/70 mt-1 leading-snug">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-navy-dark py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-gold tracking-widest text-xs mb-1">THE PEOPLE BEHIND YOUR CAKES</div>
            <h3 className="font-display text-4xl text-cream tracking-tight">Meet Our Team</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div key={i} className="bg-navy-card text-center p-6">
                <img src={member.image} alt={member.role} className="w-36 h-36 mx-auto rounded-full object-cover mb-6 border-4 border-gold/10" />
                <div className="font-display text-2xl text-cream tracking-tight">{member.role}</div>
                <div className="text-gold text-sm mt-1 tracking-wider">{member.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gold py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-y-8 text-center text-navy">
          <div>
            <div className="text-5xl font-display tracking-tighter">37+</div>
            <div className="text-xs tracking-[1.5px] mt-1">YEARS OF BAKING HERITAGE</div>
          </div>
          <div>
            <div className="text-5xl font-display tracking-tighter">18,000+</div>
            <div className="text-xs tracking-[1.5px] mt-1">HAPPY CUSTOMERS</div>
          </div>
          <div>
            <div className="text-5xl font-display tracking-tighter">2</div>
            <div className="text-xs tracking-[1.5px] mt-1">LOCATIONS IN LALITPUR</div>
          </div>
          <div>
            <div className="text-5xl font-display tracking-tighter">447+</div>
            <div className="text-xs tracking-[1.5px] mt-1">GOOGLE REVIEWS</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
