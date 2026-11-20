import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Wrench } from 'lucide-react';

interface Props {
  name: any;
  className?: string;
  strokeWidth?: number;
}

export default function DynamicIcon({ name, className = 'w-6 h-6', strokeWidth = 2 }: Props) {
  if (!name) {
    return <Wrench className={className} strokeWidth={strokeWidth} />;
  }

  // If already a React component / element
  if (typeof name === 'function' || (typeof name === 'object' && name !== null && '$$typeof' in name)) {
    const Component = name;
    return <Component className={className} strokeWidth={strokeWidth} />;
  }

  // If emoji or single/double char
  if (typeof name === 'string') {
    if (name.length <= 4 && !/[a-zA-Z]/.test(name)) {
      return <span className="text-xl leading-none">{name}</span>;
    }

    // Lookup in LucideIcons
    const pascalName = name.charAt(0).toUpperCase() + name.slice(1);
    const FoundIcon = (LucideIcons as any)[name] || (LucideIcons as any)[pascalName];
    if (FoundIcon) {
      return <FoundIcon className={className} strokeWidth={strokeWidth} />;
    }
  }

  return <Wrench className={className} strokeWidth={strokeWidth} />;
}
