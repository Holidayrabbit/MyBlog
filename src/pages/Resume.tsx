import React from 'react';
import { useTranslation } from 'react-i18next';
import { profile, type Language, type Text, type ResumeEntry } from '../data/profile';

/** 行内富文本：[文字](链接) → 超链接，**文字** → 加粗 */
const INLINE_PATTERN = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let index = 0;
  let match: RegExpExecArray | null;
  INLINE_PATTERN.lastIndex = 0;
  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      nodes.push(
        <a key={`${keyPrefix}-${index++}`} href={match[2]} target="_blank" rel="noopener noreferrer">
          {match[1]}
        </a>,
      );
    } else {
      nodes.push(<strong key={`${keyPrefix}-${index++}`}>{match[3]}</strong>);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

type Translate = (text: Text) => string;

/** 经历类条目（教育 / 研究经历 / 项目经历 / 实习共用） */
const EntryList: React.FC<{ entries: ResumeEntry[]; T: Translate }> = ({ entries, T }) => (
  <div className="experience-list">
    {entries.map((entry, entryIndex) => (
      <div key={entryIndex} className="experience-item">
        <div className="experience-period">{T(entry.period)}</div>
        <div className="experience-content">
          <h4>{T(entry.title)}</h4>
          {entry.subtitle && <p className="entry-subtitle">{renderInline(T(entry.subtitle), `e${entryIndex}-s`)}</p>}
          {entry.bullets && entry.bullets.length > 0 && (
            <ul className="entry-bullets">
              {entry.bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex}>{renderInline(T(bullet), `e${entryIndex}-${bulletIndex}`)}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    ))}
  </div>
);

const Resume: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang: Language = i18n.language.startsWith('zh') ? 'zh' : 'en';
  const T: Translate = (text) => (typeof text === 'string' ? text : text[lang]);

  return (
    <div className="container">
      <div className="profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-avatar">
            <img src={`${import.meta.env.BASE_URL}${profile.avatar}`} alt={T(profile.name)} />
          </div>
          <div>
            <h1 className="profile-name">{T(profile.name)}</h1>
            <p className="profile-role">{T(profile.role)}</p>
          </div>
          <p className="profile-location">📍 {T(profile.location)}</p>
          <a className="profile-email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <nav className="profile-links">
            {profile.links.map((link) => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ))}
          </nav>
          <a className="profile-cv-btn" href={`${import.meta.env.BASE_URL}${profile.resumePdf}`} download>
            📄 {t('downloadResume')}
          </a>
        </aside>

        <div className="profile-main">
          <section className="profile-section">
            <h2>{T(profile.sectionTitles.about)}</h2>
            {profile.about.map((paragraph, index) => (
              <p key={index} className="profile-paragraph">{T(paragraph)}</p>
            ))}
          </section>

          {profile.interests.length > 0 && (
            <section className="profile-section">
              <h2>{T(profile.sectionTitles.interests)}</h2>
              <div className="profile-tags">
                {profile.interests.map((interest, index) => (
                  <span key={index} className="profile-tag">{T(interest)}</span>
                ))}
              </div>
            </section>
          )}

          {profile.education.length > 0 && (
            <section className="profile-section">
              <h2>{T(profile.sectionTitles.education)}</h2>
              <EntryList entries={profile.education} T={T} />
            </section>
          )}

          {profile.awards.length > 0 && (
            <section className="profile-section">
              <h2>{T(profile.sectionTitles.awards)}</h2>
              <ul className="profile-award-list">
                {profile.awards.map((award, index) => (
                  <li key={index}>
                    {award.year && <span className="award-year">{award.year} </span>}
                    {award.url ? (
                      <a href={award.url} target="_blank" rel="noopener noreferrer">{T(award.name)}</a>
                    ) : (
                      T(award.name)
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {profile.research.length > 0 && (
            <section className="profile-section">
              <h2>{T(profile.sectionTitles.research)}</h2>
              <EntryList entries={profile.research} T={T} />
            </section>
          )}

          {profile.projects.length > 0 && (
            <section className="profile-section">
              <h2>{T(profile.sectionTitles.projects)}</h2>
              <EntryList entries={profile.projects} T={T} />
            </section>
          )}

          {profile.internships.length > 0 && (
            <section className="profile-section">
              <h2>{T(profile.sectionTitles.internships)}</h2>
              <EntryList entries={profile.internships} T={T} />
            </section>
          )}

          {profile.skills.length > 0 && (
            <section className="profile-section">
              <h2>{T(profile.sectionTitles.skills)}</h2>
              <ul className="entry-bullets skill-lines">
                {profile.skills.map((line, index) => (
                  <li key={index}>{renderInline(T(line), `s${index}`)}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resume;
