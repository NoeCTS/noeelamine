import { forwardRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Campaign {
  id: string;
  name: string;
  description: string;
  hasDetailPage: boolean;
}

const campaigns: Campaign[] = [
  {
    id: 'nothing',
    name: 'NOTHING',
    description: 'Concept campaign for Nothing Technology — reimagining their visual language.',
    hasDetailPage: true,
  },
  {
    id: 'pangaia',
    name: 'PANGAIA',
    description: 'Sustainable fashion concept campaign — coming soon.',
    hasDetailPage: false,
  },
];

const ConceptCampaignsSection = forwardRef<HTMLElement>((_, ref) => {
  const [activeTab, setActiveTab] = useState('nothing');
  const navigate = useNavigate();

  const handleCampaignClick = (campaign: Campaign) => {
    if (campaign.hasDetailPage) {
      navigate(`/${campaign.id}`);
    }
  };

  return (
    <section ref={ref} id="concept-campaigns" className="relative py-section w-full">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <div className="flex flex-col md:flex-row gap-24">
          {/* Sticky Label */}
          <div className="md:w-1/4">
            <div className="sticky top-32 text-sm font-medium tracking-wide text-secondary uppercase">
              Concept Campaigns
            </div>
          </div>

          {/* Tabs Content */}
          <div className="md:w-3/4">
            {/* Tab Buttons */}
            <div className="flex gap-8 mb-12 border-b border-foreground/10">
              {campaigns.map((campaign) => (
                <button
                  key={campaign.id}
                  onClick={() => setActiveTab(campaign.id)}
                  className={`pb-4 text-sm font-medium tracking-wide uppercase transition-all relative ${
                    activeTab === campaign.id 
                      ? 'text-foreground' 
                      : 'text-secondary hover:text-foreground/70'
                  }`}
                >
                  {campaign.name}
                  {activeTab === campaign.id && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className={`transition-opacity duration-300 ${
                  activeTab === campaign.id ? 'opacity-100' : 'opacity-0 hidden'
                }`}
              >
                <div 
                  className={`group ${campaign.hasDetailPage ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => handleCampaignClick(campaign)}
                >
                  <h3 className="text-headline font-semibold tracking-tighter mb-3">
                    {campaign.name}
                  </h3>
                  <p className="text-body text-secondary max-w-lg mb-6">
                    {campaign.description}
                  </p>
                  {campaign.hasDetailPage ? (
                    <span className="text-sm text-accent group-hover:underline">
                      View Campaign →
                    </span>
                  ) : (
                    <span className="text-sm text-tertiary">
                      Coming soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

ConceptCampaignsSection.displayName = 'ConceptCampaignsSection';

export default ConceptCampaignsSection;
