type Analytics = {
totalSavings: number;
// add other properties here if needed
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
message: 💰 You've earned C:\Users\joshp\Downloads\postureguard-app\app\components{analytics?.totalSavings?.toFixed(0) || '0'} in health value! Unlock UNLIMITED earning potential with Premium!,
cta: 'Upgrade & Earn More',
duration: 12000,
conditions: (analytics) => analytics?.totalSavings !== undefined,
priority: 1,
minRealActivity: 50,
},
// Add more triggers here if needed
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
