import sys
import re

file_path = 'src/components/AdminDashboardView.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove admin-specific utility styles that conflict or are redundant
content = re.sub(r'\s*/\*\s*Utility styles for sub-views\s*\*/.*?(?=</style>)', '\n', content, flags=re.DOTALL)

# Global Class Replacements
content = content.replace('admin-card-header', 'card-header')
content = content.replace('admin-card-title', 'card-title')
content = content.replace('admin-card', 'card')

# Table replacements
content = content.replace('<table class="admin-table">', '<div class="table-container"><table class="data-table">')
content = content.replace('</table>', '</table></div>')

# Badge replacements
content = content.replace('admin-badge badge-green', 'badge" style="background:#dcfce7; color:#15803d;')
content = content.replace('admin-badge badge-yellow', 'badge" style="background:#fef3c7; color:#b45309;')
content = content.replace('admin-badge badge-red', 'badge" style="background:#fee2e2; color:#b91c1c;')
content = content.replace('admin-badge badge-gray', 'badge" style="background:#f1f5f9; color:#475569;')
content = content.replace('admin-badge', 'badge')

# KPI Grid replacement in Dashboard
content = content.replace('<div class="admin-grid" style="margin-bottom: 24px;">', '<div class="kpi-grid" style="margin-bottom: 24px;">')

# Other admin-grid replacements (like AI tab)
content = content.replace('admin-grid', 'kpi-grid')

# Replace kpiCard function
old_kpi = """    function kpiCard(icon, title, value, badgeClass = 'badge-gray') {
      return `
        <div class="card" style="padding:16px; margin-bottom:0;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div style="color:var(--slate-500); font-weight:500; font-size:0.875rem;">${title}</div>
            <i data-lucide="${icon}" style="color:var(--med-teal); width:20px;height:20px;"></i>
          </div>
          <div style="font-size:1.75rem; font-weight:700; color:var(--slate-800); margin-bottom:4px;">${value}</div>
        </div>
      `;
    }"""

new_kpi = """    function kpiCard(icon, title, value, type = 'info') {
      let accent = 'var(--primary-600)';
      let bg = 'var(--primary-50)';
      let valColor = 'var(--slate-800)';
      
      // Map the old badgeClass strings passed in from renderTabDashboard
      if (type === 'badge-red') { accent = '#ef4444'; bg = '#fee2e2'; valColor = '#b91c1c'; }
      if (type === 'badge-green') { accent = '#10b981'; bg = '#dcfce7'; valColor = '#15803d'; }
      if (type === 'badge-yellow') { accent = '#f59e0b'; bg = '#fef3c7'; valColor = '#b45309'; }
      
      return `
        <div class="kpi-card" style="--kpi-accent: ${accent}; --kpi-bg: ${bg}; margin-bottom:0; cursor:default; transform:none;">
          <div>
            <div class="kpi-label">${title}</div>
            <div class="kpi-value" style="color:${valColor};">${value}</div>
          </div>
          <div class="kpi-icon-box">
            <i data-lucide="${icon}" style="width:24px;height:24px;"></i>
          </div>
        </div>
      `;
    }"""

content = content.replace(old_kpi, new_kpi)

# Fix icon colors in card titles
content = re.sub(r'(<h3 class="card-title"><i data-lucide="[^"]+")', r'\1 style="width:20px;height:20px; color:var(--primary-600);"', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('File updated.')
