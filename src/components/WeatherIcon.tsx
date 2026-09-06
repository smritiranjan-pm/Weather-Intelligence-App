import React from 'react';
import {
  Sun,
  SunDim,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudSnow,
  CloudRain,
  CloudRainWind,
  CloudHail,
  Snowflake,
  CloudSunRain,
  CloudLightning,
  Umbrella,
  Wind,
  ThermometerSnowflake,
  ShieldAlert,
  Smile,
  Compass,
  Droplets,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  Navigation,
  MapPin,
  HelpCircle,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6', size }) => {
  const iconMap: Record<string, React.ElementType> = {
    Sun,
    SunDim,
    CloudSun,
    Cloud,
    CloudFog,
    CloudDrizzle,
    CloudSnow,
    CloudRain,
    CloudRainWind,
    CloudHail,
    Snowflake,
    CloudSunRain,
    CloudLightning,
    Umbrella,
    Wind,
    ThermometerSnowflake,
    ShieldAlert,
    Smile,
    Compass,
    Droplets,
    Gauge,
    Eye,
    Sunrise,
    Sunset,
    Navigation,
    MapPin,
  };

  const IconComponent = iconMap[name] || HelpCircle;

  return <IconComponent className={className} size={size} />;
};
