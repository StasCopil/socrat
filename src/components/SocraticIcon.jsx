import React from 'react';
import { 
  Scale, 
  ShieldAlert, 
  Atom, 
  GitFork, 
  Compass, 
  Brain, 
  Cpu, 
  Target, 
  Radio, 
  Search, 
  Eye, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  Zap,
  Terminal,
  MessageSquare
} from 'lucide-react';

const ICON_MAP = {
  classic: Scale,
  Scale: Scale,
  devil: ShieldAlert,
  ShieldAlert: ShieldAlert,
  first_principles: Atom,
  Atom: Atom,
  pragmatist: GitFork,
  GitFork: GitFork,
  maieutic: Compass,
  Compass: Compass,
  Brain: Brain,
  Cpu: Cpu,
  Target: Target,
  Radio: Radio,
  Search: Search,
  Eye: Eye,
  CheckCircle2: CheckCircle2,
  HelpCircle: HelpCircle,
  Sparkles: Sparkles,
  Zap: Zap,
  Terminal: Terminal,
  MessageSquare: MessageSquare
};

export default function SocraticIcon({ name, className = "w-4 h-4", defaultIcon = Terminal }) {
  const IconComponent = ICON_MAP[name] || defaultIcon;
  return <IconComponent className={className} />;
}
