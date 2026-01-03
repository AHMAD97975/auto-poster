import React from 'react';
import { Campaign } from '../types';

const PlatformIcon: React.FC<{ platform: string }> = ({ platform }) => {
  const getCode = (p: string) => {
      switch(p) {
          case 'facebook': return 'FB';
          case 'instagram': return 'IG';
          case 'twitter': return 'TW';
          case 'linkedin': return 'LI';
          default: return 'SM';
      }
  };
  const getColor = (p: string) => {
      switch(p) {
          case 'facebook': return 'bg-blue-100 text-blue-700';
          case 'instagram': return 'bg-pink-100 text-pink-700';
          case 'twitter': return 'bg-sky-100 text-sky-700';
          case 'linkedin': return 'bg-indigo-100 text-indigo-700';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  return (
      <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-1 ring-white ${getColor(platform)}`}>
          {getCode(platform)}
      </span>
  );
};

interface CampaignCardProps {
  campaign: Campaign;
  onClick: () => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onClick }) => {
  const statusColors = {
    created: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    paused: 'bg-gray-100 text-gray-800',
  };

  const statusTranslations = {
    created: 'تم الإنشاء',
    active: 'نشطة',
    completed: 'مكتملة',
    paused: 'موقوفة'
  };

  const pendingPosts = campaign.posts.filter(p => p.status === 'pending').length;
  
  return (
    <div 
      onClick={onClick}
      className="bg-white overflow-hidden rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer border border-gray-100"
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 truncate flex-1 ml-2">{campaign.title || campaign.topic}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[campaign.state]}`}>
                {statusTranslations[campaign.state] || campaign.state}
            </span>
        </div>

        <div className="mb-3">
             <p className="text-sm text-gray-600 line-clamp-1">{campaign.topic}</p>
             <p className="text-xs text-gray-400 mt-1">الجمهور: {campaign.targetAudience}</p>
        </div>
        
        <div className="flex items-center -space-x-2 space-x-reverse mb-4">
            {campaign.platforms.map(p => <PlatformIcon key={p} platform={p} />)}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 border-t border-gray-100 pt-4">
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">المدة</p>
                <p className="font-semibold text-gray-700">{campaign.durationDays} أيام</p>
            </div>
            <div>
                 <p className="text-xs text-gray-500 uppercase tracking-wide">المنشورات المعلقة</p>
                 <p className="font-semibold text-gray-700">{pendingPosts}</p>
            </div>
        </div>
      </div>
    </div>
  );
};