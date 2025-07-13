import React, { useState } from 'react';
import { IoStatsChart, IoBarChart, IoPieChart, IoAnalytics, IoChevronDown, IoChevronUp, IoDocumentText, IoImage } from 'react-icons/io5';

interface DataAnalysisResult {
  summary: string;
  description: Record<string, any>;
  plots?: Record<string, string>;
  forecast?: any;
  report_id?: string;
  created_at?: string;
}

interface DataAnalysisDisplayProps {
  data: DataAnalysisResult;
}

const DataAnalysisDisplay: React.FC<DataAnalysisDisplayProps> = ({ data }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    summary: true,
    statistics: false,
    plots: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatStatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'number') {
      return value.toLocaleString('en-US', { 
        maximumFractionDigits: 2,
        minimumFractionDigits: value % 1 === 0 ? 0 : 2
      });
    }
    return String(value);
  };

  const getStatIcon = (columnName: string) => {
    const name = columnName.toLowerCase();
    if (name.includes('age') || name.includes('year')) return <IoStatsChart className="text-blue-500" />;
    if (name.includes('cost') || name.includes('price') || name.includes('revenue')) return <IoBarChart className="text-green-500" />;
    if (name.includes('quantity') || name.includes('count')) return <IoPieChart className="text-purple-500" />;
    return <IoAnalytics className="text-gray-500" />;
  };

  const renderStatistics = () => {
    if (!data.description) return null;

    return (
      <div className="space-y-4">
        {Object.entries(data.description).map(([columnName, stats]) => (
          <div key={columnName} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              {getStatIcon(columnName)}
              <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                {columnName.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {stats.count !== undefined && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                  <div className="text-gray-500 dark:text-gray-400 text-xs">Count</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatStatValue(stats.count)}
                  </div>
                </div>
              )}
              
              {stats.unique !== undefined && stats.unique !== null && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                  <div className="text-gray-500 dark:text-gray-400 text-xs">Unique</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatStatValue(stats.unique)}
                  </div>
                </div>
              )}
              
              {stats.mean !== undefined && stats.mean !== null && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                  <div className="text-gray-500 dark:text-gray-400 text-xs">Mean</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatStatValue(stats.mean)}
                  </div>
                </div>
              )}
              
              {stats.std !== undefined && stats.std !== null && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                  <div className="text-gray-500 dark:text-gray-400 text-xs">Std Dev</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatStatValue(stats.std)}
                  </div>
                </div>
              )}
              
              {stats.min !== undefined && stats.min !== null && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                  <div className="text-gray-500 dark:text-gray-400 text-xs">Min</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatStatValue(stats.min)}
                  </div>
                </div>
              )}
              
              {stats.max !== undefined && stats.max !== null && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                  <div className="text-gray-500 dark:text-gray-400 text-xs">Max</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatStatValue(stats.max)}
                  </div>
                </div>
              )}
              
              {stats.top !== undefined && stats.top !== null && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                  <div className="text-gray-500 dark:text-gray-400 text-xs">Most Common</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatStatValue(stats.top)}
                  </div>
                </div>
              )}
              
              {stats.freq !== undefined && stats.freq !== null && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                  <div className="text-gray-500 dark:text-gray-400 text-xs">Frequency</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatStatValue(stats.freq)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPlots = () => {
    if (!data.plots || Object.keys(data.plots).length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <IoImage className="mx-auto text-4xl mb-2" />
          <p>No plots available</p>
        </div>
      );
    }

    const plotCategories = {
      'Box Plots': Object.keys(data.plots).filter(key => key.startsWith('box_')),
      'Histograms': Object.keys(data.plots).filter(key => key.startsWith('hist_')),
      'Scatter Plots': Object.keys(data.plots).filter(key => key.startsWith('scatter_')),
      'Correlation': Object.keys(data.plots).filter(key => key.includes('correlation')),
    };

    return (
      <div className="space-y-6">
        {Object.entries(plotCategories).map(([category, plotKeys]) => {
          if (plotKeys.length === 0) return null;
          
          return (
            <div key={category} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <IoImage className="mr-2" />
                {category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plotKeys.map(plotKey => (
                  <div key={plotKey} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      {plotKey.replace(/^(box_|hist_|scatter_)/, '').replace(/_/g, ' vs ')}
                    </h5>
                                         <img 
                       src={`data:image/png;base64,${data.plots![plotKey]}`}
                       alt={plotKey}
                       className="w-full h-auto rounded border border-gray-200 dark:border-gray-600"
                     />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 border border-blue-200 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <IoAnalytics className="text-white text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Data Analysis Results</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.report_id && `Report ID: ${data.report_id}`}
            {data.created_at && ` • Created: ${new Date(data.created_at).toLocaleString()}`}
          </p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('summary')}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <IoDocumentText className="text-blue-500" />
            <span className="font-semibold text-gray-900 dark:text-white">Summary</span>
          </div>
          {expandedSections.summary ? <IoChevronUp /> : <IoChevronDown />}
        </button>
        
        {expandedSections.summary && (
          <div className="mt-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-700 p-3 rounded">
                {data.summary}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('statistics')}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <IoStatsChart className="text-green-500" />
            <span className="font-semibold text-gray-900 dark:text-white">Statistics</span>
          </div>
          {expandedSections.statistics ? <IoChevronUp /> : <IoChevronDown />}
        </button>
        
        {expandedSections.statistics && (
          <div className="mt-3">
            {renderStatistics()}
          </div>
        )}
      </div>

      {/* Plots Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('plots')}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <IoImage className="text-purple-500" />
            <span className="font-semibold text-gray-900 dark:text-white">Visualizations</span>
          </div>
          {expandedSections.plots ? <IoChevronUp /> : <IoChevronDown />}
        </button>
        
        {expandedSections.plots && (
          <div className="mt-3">
            {renderPlots()}
          </div>
        )}
      </div>

      {/* Forecast Section */}
      {data.forecast && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <IoAnalytics className="mr-2 text-orange-500" />
            Forecast
          </h4>
          <pre className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded overflow-x-auto">
            {JSON.stringify(data.forecast, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DataAnalysisDisplay; 