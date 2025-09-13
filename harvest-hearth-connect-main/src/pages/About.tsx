import Header from "@/components/Header";

const About = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-foreground">About Harvest Hearth Connect</h1>
        <p className="text-lg text-muted-foreground mb-6">
          KrishiSettu is a platform designed to bridge the gap between farmers and buyers, enabling direct connections, fair auctions, and end-to-end solutions for agricultural trade. Our mission is to empower farmers, provide buyers with trusted produce, and create a transparent marketplace for all stakeholders.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-primary">Our Vision</h2>
            <p className="text-muted-foreground">
              To revolutionize the agricultural marketplace by leveraging technology for transparency, efficiency, and growth. We aim to make trading easier, faster, and more reliable for everyone involved.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-primary">Key Features</h2>
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>Direct farmer-to-buyer connections</li>
              <li>Live and fair auction system</li>
              <li>Verified users and secure transactions</li>
              <li>End-to-end logistics support</li>
              <li>Analytics and insights for better decision making</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;