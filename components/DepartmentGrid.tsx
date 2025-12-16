
import React from 'react';
import { useContent } from '../context/ContentContext';
import { Reveal } from './UI/Reveal';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const DepartmentGrid: React.FC = () => {
  const { content } = useContent();
  const departments = content.departments;

  // Split departments according to requirement: 3 Top (Core), 4 Bottom (Support)
  const topDepartments = departments.slice(0, 3);
  const bottomDepartments = departments.slice(3, 7);

  // Helper to get representative image and name
  const getRepInfo = (dept: any) => {
    // If manager is defined, try to find their specific member entry for an image, 
    // otherwise default to the first member found.
    // In the provided data, often the manager is not explicitly in the members list with an ID matching 'manager',
    // so we rely on the visual instruction: "Manager Name" is provided.
    // For image, we try to find a member with the manager's name, or default to the first member's image.
    
    let repName = dept.manager;
    let repImage = dept.members?.[0]?.image; // Default to first member

    // If no manager name explicitly set (like Order/Dispatch/Finance in data), use first member
    if (!repName && dept.members.length > 0) {
        repName = dept.members[0].name;
    }

    // Try to find the exact image if we have a manager name
    const managerMember = dept.members.find((m: any) => m.name === repName);
    if (managerMember) {
        repImage = managerMember.image;
    }

    return { name: repName, image: repImage };
  };

  const Card = ({ dept, heightClass }: { dept: any, heightClass: string }) => {
    const { name, image } = getRepInfo(dept);
    
    return (
        <Link 
            to={`/team#${dept.id}`} 
            className={`group relative block w-full ${heightClass} overflow-hidden bg-stone-200`}
        >
            <img 
                src={image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'} 
                alt={dept.department} 
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="text-[10px] font-bold tracking-widest uppercase text-stone-400 mb-1">Department</div>
                <h3 className="text-xl md:text-2xl font-light mb-1">{dept.department}</h3>
                <div className="flex items-center justify-between mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 border-t border-white/20 pt-4">
                    <span className="text-sm font-serif italic text-stone-300">{name}</span>
                    <ArrowRight size={16} className="text-white" />
                </div>
            </div>
        </Link>
    );
  };

  return (
    <section className="py-24 bg-white border-b border-stone-100">
        <div className="container mx-auto px-6 md:px-12">
            <div className="mb-16 text-center">
                <Reveal>
                    <span className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-4 block">Organization</span>
                    <h2 className="text-3xl md:text-4xl font-light text-stone-900">部门架构</h2>
                </Reveal>
            </div>

            <div className="space-y-6">
                {/* Top Row: 3 Items */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {topDepartments.map((dept, idx) => (
                        <Reveal key={dept.id} delay={idx * 0.1}>
                           <Card dept={dept} heightClass="h-[400px]" />
                        </Reveal>
                    ))}
                </div>

                {/* Bottom Row: 4 Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {bottomDepartments.map((dept, idx) => (
                        <Reveal key={dept.id} delay={0.3 + (idx * 0.1)}>
                            <Card dept={dept} heightClass="h-[300px]" />
                        </Reveal>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
};
