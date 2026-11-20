import { NextResponse } from 'next/server';
import { getActiveTools, getAllTools, DEFAULT_CATEGORIES } from '@/lib/tools-store';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const all = searchParams.get('all') === 'true';

    let tools = all ? getAllTools() : getActiveTools();

    if (category) {
      tools = tools.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      tools = tools.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    // Group by categories
    const categoriesMap = new Map<string, typeof tools>();
    for (const tool of tools) {
      const cat = tool.category || 'Other Tools';
      if (!categoriesMap.has(cat)) {
        categoriesMap.set(cat, []);
      }
      categoriesMap.get(cat)!.push(tool);
    }

    const grouped = DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      tools: categoriesMap.get(cat.name) || [],
    })).filter(g => g.tools.length > 0);

    // Also include any new custom categories created by admin
    for (const [catName, catTools] of categoriesMap.entries()) {
      if (!grouped.some(g => g.name === catName)) {
        grouped.push({
          name: catName,
          description: `Utilities in ${catName}`,
          icon: '✨',
          color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
          tools: catTools,
        });
      }
    }

    return NextResponse.json({
      success: true,
      total: tools.length,
      tools,
      grouped,
    });
  } catch (error: any) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}
