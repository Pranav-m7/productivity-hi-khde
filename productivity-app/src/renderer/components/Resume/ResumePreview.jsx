import React from 'react';

const TEMPLATES = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  technical: TechnicalTemplate,
  creative: CreativeTemplate,
  minimal: MinimalTemplate,
};

function ResumePreview({ resume, zoom }) {
  const Template = TEMPLATES[resume.template] || ModernTemplate;

  return (
    <div className="flex justify-center">
      <div
        className="bg-white text-black shadow-2xl"
        style={{
          width: `${8.5 * 96}px`,
          minHeight: `${11 * 96}px`,
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
        }}
      >
        <Template resume={resume} />
      </div>
    </div>
  );
}

function ModernTemplate({ resume }) {
  const { personalInfo, summary, sections } = resume;

  return (
    <div className="p-8 font-sans text-sm">
      {/* Header */}
      <div className="border-b-2 border-blue-500 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-lg text-blue-600 mt-1">{personalInfo.title || 'Professional Title'}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-600">
          {personalInfo.email && <span>📧 {personalInfo.email}</span>}
          {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>💼 LinkedIn</span>}
          {personalInfo.github && <span>💻 GitHub</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-2">Summary</h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Sections */}
      {sections.map(section => (
        <div key={section.id} className="mb-6">
          {section.items.length > 0 && (
            <>
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 mb-3">{section.title}</h2>
              {section.type === 'experience' && section.items.map((item, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-semibold">{item.title}</span>
                      {item.company && <span className="text-gray-600"> at {item.company}</span>}
                    </div>
                    <span className="text-gray-500 text-xs">{item.startDate} - {item.endDate || 'Present'}</span>
                  </div>
                  {item.responsibilities && (
                    <ul className="mt-2 ml-4 list-disc text-gray-700">
                      {item.responsibilities.split('\n').filter(r => r.trim()).map((r, j) => (
                        <li key={j}>{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              {section.type === 'education' && section.items.map((item, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-semibold">{item.degree}</span>
                      {item.field && <span className="text-gray-600"> in {item.field}</span>}
                    </div>
                    <span className="text-gray-500 text-xs">{item.startDate} - {item.endDate}</span>
                  </div>
                  <div className="text-gray-600">{item.school}</div>
                  {item.gpa && <div className="text-gray-500 text-xs">GPA: {item.gpa}</div>}
                </div>
              ))}
              {section.type === 'skills' && (
                <div className="space-y-2">
                  {section.items.map((item, i) => (
                    <div key={i}>
                      <span className="font-semibold">{item.category}: </span>
                      <span className="text-gray-700">{item.skills}</span>
                    </div>
                  ))}
                </div>
              )}
              {section.type === 'projects' && section.items.map((item, i) => (
                <div key={i} className="mb-3">
                  <div className="font-semibold">{item.name}</div>
                  {item.techStack && <div className="text-xs text-blue-600">{item.techStack}</div>}
                  {item.description && <p className="text-gray-700 mt-1">{item.description}</p>}
                </div>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function ClassicTemplate({ resume }) {
  const { personalInfo, summary, sections } = resume;

  return (
    <div className="p-10 font-serif text-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-wider">{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-gray-600 mt-1">{personalInfo.title}</p>
        <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
        </div>
      </div>

      {summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-1 mb-2">Professional Summary</h2>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}

      {sections.map(section => section.items.length > 0 && (
        <div key={section.id} className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-1 mb-3">{section.title}</h2>
          {section.type === 'experience' && section.items.map((item, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between font-semibold">
                <span>{item.company}</span>
                <span className="text-gray-500">{item.startDate} - {item.endDate || 'Present'}</span>
              </div>
              <div className="italic text-gray-600">{item.title}</div>
              {item.responsibilities && (
                <ul className="mt-1 ml-4 list-disc text-gray-700">
                  {item.responsibilities.split('\n').filter(r => r.trim()).map((r, j) => <li key={j}>{r}</li>)}
                </ul>
              )}
            </div>
          ))}
          {section.type === 'education' && section.items.map((item, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between font-semibold">
                <span>{item.school}</span>
                <span className="text-gray-500">{item.endDate}</span>
              </div>
              <div className="text-gray-600">{item.degree} {item.field && `in ${item.field}`}</div>
            </div>
          ))}
          {section.type === 'skills' && section.items.map((item, i) => (
            <div key={i} className="mb-1"><strong>{item.category}:</strong> {item.skills}</div>
          ))}
          {section.type === 'projects' && section.items.map((item, i) => (
            <div key={i} className="mb-3">
              <div className="font-semibold">{item.name}</div>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function TechnicalTemplate({ resume }) {
  const { personalInfo, summary, sections } = resume;

  return (
    <div className="p-6 font-mono text-xs">
      <div className="bg-gray-100 p-4 mb-4">
        <h1 className="text-xl font-bold">{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-gray-600">{personalInfo.title}</p>
        <div className="flex flex-wrap gap-3 mt-2 text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.github && <span>github.com/...</span>}
        </div>
      </div>

      {summary && <div className="mb-4 p-3 bg-gray-50"><p>{summary}</p></div>}

      {sections.map(section => section.items.length > 0 && (
        <div key={section.id} className="mb-4">
          <h2 className="font-bold bg-gray-800 text-white px-2 py-1 mb-2">{section.title.toUpperCase()}</h2>
          {section.type === 'experience' && section.items.map((item, i) => (
            <div key={i} className="mb-3 pl-2 border-l-2 border-gray-300">
              <div className="font-bold">{item.title} @ {item.company}</div>
              <div className="text-gray-500">{item.startDate} - {item.endDate || 'Present'}</div>
              {item.responsibilities && item.responsibilities.split('\n').filter(r => r.trim()).map((r, j) => (
                <div key={j} className="text-gray-700">→ {r}</div>
              ))}
            </div>
          ))}
          {section.type === 'skills' && (
            <div className="grid grid-cols-2 gap-2">
              {section.items.map((item, i) => (
                <div key={i} className="bg-gray-50 p-2">
                  <div className="font-bold text-gray-800">{item.category}</div>
                  <div className="text-gray-600">{item.skills}</div>
                </div>
              ))}
            </div>
          )}
          {section.type === 'projects' && section.items.map((item, i) => (
            <div key={i} className="mb-2 pl-2 border-l-2 border-blue-400">
              <div className="font-bold">{item.name}</div>
              {item.techStack && <div className="text-blue-600">[{item.techStack}]</div>}
              <div className="text-gray-700">{item.description}</div>
            </div>
          ))}
          {section.type === 'education' && section.items.map((item, i) => (
            <div key={i} className="mb-2">
              <span className="font-bold">{item.degree}</span> - {item.school} ({item.endDate})
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function CreativeTemplate({ resume }) {
  const { personalInfo, summary, sections } = resume;

  return (
    <div className="flex min-h-full">
      <div className="w-1/3 bg-gradient-to-b from-purple-600 to-blue-600 text-white p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold">{personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-purple-200 text-sm mt-1">{personalInfo.title}</p>
        </div>
        <div className="space-y-3 text-xs">
          {personalInfo.email && <div>📧 {personalInfo.email}</div>}
          {personalInfo.phone && <div>📱 {personalInfo.phone}</div>}
          {personalInfo.location && <div>📍 {personalInfo.location}</div>}
          {personalInfo.linkedin && <div>💼 LinkedIn</div>}
          {personalInfo.github && <div>💻 GitHub</div>}
        </div>
        {sections.find(s => s.type === 'skills')?.items.length > 0 && (
          <div className="mt-8">
            <h2 className="font-bold mb-3">Skills</h2>
            {sections.find(s => s.type === 'skills').items.map((item, i) => (
              <div key={i} className="mb-3">
                <div className="font-semibold text-purple-200 text-xs">{item.category}</div>
                <div className="text-xs">{item.skills}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="w-2/3 p-6 text-sm">
        {summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-purple-600 mb-2">About Me</h2>
            <p className="text-gray-700">{summary}</p>
          </div>
        )}
        {sections.filter(s => s.type !== 'skills').map(section => section.items.length > 0 && (
          <div key={section.id} className="mb-6">
            <h2 className="text-lg font-bold text-purple-600 mb-3">{section.title}</h2>
            {section.type === 'experience' && section.items.map((item, i) => (
              <div key={i} className="mb-4 relative pl-4 border-l-2 border-purple-200">
                <div className="absolute -left-1.5 top-0 w-3 h-3 bg-purple-600 rounded-full"></div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-purple-600 text-xs">{item.company} • {item.startDate} - {item.endDate || 'Present'}</div>
                {item.responsibilities && (
                  <ul className="mt-1 text-gray-600 text-xs list-disc ml-4">
                    {item.responsibilities.split('\n').filter(r => r.trim()).map((r, j) => <li key={j}>{r}</li>)}
                  </ul>
                )}
              </div>
            ))}
            {section.type === 'education' && section.items.map((item, i) => (
              <div key={i} className="mb-2">
                <div className="font-semibold">{item.degree}</div>
                <div className="text-gray-600 text-xs">{item.school} • {item.endDate}</div>
              </div>
            ))}
            {section.type === 'projects' && section.items.map((item, i) => (
              <div key={i} className="mb-3">
                <div className="font-semibold">{item.name}</div>
                {item.techStack && <div className="text-purple-600 text-xs">{item.techStack}</div>}
                <p className="text-gray-600 text-xs">{item.description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function MinimalTemplate({ resume }) {
  const { personalInfo, summary, sections } = resume;

  return (
    <div className="p-12 font-sans text-sm max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-light text-gray-900">{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-gray-500 mt-2">{personalInfo.title}</p>
        <div className="flex gap-6 mt-4 text-xs text-gray-400">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {summary && <p className="text-gray-600 mb-10 leading-relaxed">{summary}</p>}

      {sections.map(section => section.items.length > 0 && (
        <div key={section.id} className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-4">{section.title}</h2>
          {section.type === 'experience' && section.items.map((item, i) => (
            <div key={i} className="mb-6">
              <div className="flex justify-between items-baseline">
                <span className="font-medium">{item.title}</span>
                <span className="text-xs text-gray-400">{item.startDate} — {item.endDate || 'Present'}</span>
              </div>
              <div className="text-gray-500">{item.company}</div>
              {item.responsibilities && (
                <ul className="mt-2 text-gray-600 space-y-1">
                  {item.responsibilities.split('\n').filter(r => r.trim()).map((r, j) => <li key={j}>• {r}</li>)}
                </ul>
              )}
            </div>
          ))}
          {section.type === 'education' && section.items.map((item, i) => (
            <div key={i} className="mb-4">
              <div className="font-medium">{item.degree} {item.field && `in ${item.field}`}</div>
              <div className="text-gray-500">{item.school}, {item.endDate}</div>
            </div>
          ))}
          {section.type === 'skills' && (
            <div className="text-gray-600">
              {section.items.map((item, i) => (
                <span key={i}>{item.skills}{i < section.items.length - 1 ? ' • ' : ''}</span>
              ))}
            </div>
          )}
          {section.type === 'projects' && section.items.map((item, i) => (
            <div key={i} className="mb-4">
              <div className="font-medium">{item.name}</div>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ResumePreview;
