type Analytics = {
totalSavings: number;
realPostureReadings: number;
};
'use client';
import { useState, useEffect } from 'react';
import { useCustomerData } from '../lib/userDataManager';
interface TriggerConfig {
id: string;
type: 'value' | 'community' | 'achievement' | 'progress' | 'support' | 'premium' | 'urgency';
message: string;
cta: string;
duration: number;
conditions: (analytics: Analytics | null) => boolean;
priority: number;
minRealActivity: number;
}
export default function MonetizationTriggers() {
const { analytics, recordEngagement, triggerUpgrade } = useCustomerData() as {
analytics: Analytics | null;
recordEngagement: any;
triggerUpgrade: any;
};
const triggers: TriggerConfig[] = [
{
id: 'value_demonstration_upgrade',
type: 'value',
message: 💰 You've earned {analytics?.totalSavings?.toFixed(0) || '0'} in health value! Unlock UNLIMITED earning potential with Premium!,
cta: 'Upgrade & Earn More',
duration: 12000,
conditions: (analytics) => analytics?.totalSavings !== undefined,
priority: 1,
minRealActivity: 50,
},
{
id: 'achievement_milestone_upgrade',
type: 'achievement',
message: 🎯 MILESTONE REACHED!  sessions completed! Premium users earn 3x more rewards!,
cta: 'Triple My Rewards',
duration: 10000,
conditions: (analytics) => analytics?.realPostureReadings !== undefined,
priority: 2,
minRealActivity: 100,
}
];
return (
<div>
{triggers.map((trigger) => (
<div key={trigger.id}>
<p>{trigger.message}</p>
<button onClick={triggerUpgrade}>{trigger.cta}</button>
</div>
))}
</div>
);
}
