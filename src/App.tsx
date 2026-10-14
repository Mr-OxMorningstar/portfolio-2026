import Block from './components/Block';
import Credentials from './components/Credentials';
import EmailButton from './components/EmailButton';
import Experience from './components/Experience';
import Header from './components/Header';
import OfficeView from './components/OfficeView';
import Project from './components/Project';
import Savings from './components/Savings';
import SideProjects from './components/SideProjects';
import Skills from './components/Skills';
import { booking, office } from './data/profile';

export default function App() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <Header />
      <main>
        <Block id="work" title="Selected work">
          <div className="space-y-20">
            <Savings />
            <Project {...booking} />
            <Project title={office.title} summary={office.summary} points={office.points} stack={office.stack}>
              <OfficeView caption={office.caption} />
            </Project>
          </div>
        </Block>
        <Block id="experience" title="Experience">
          <Experience />
        </Block>
        <Block id="other" title="Other projects">
          <SideProjects />
        </Block>
        <Block id="skills" title="Skills">
          <Skills />
        </Block>
        <Block id="credentials" title="Credentials and education">
          <Credentials />
        </Block>
      </main>
      <footer className="border-t border-rule py-12">
        <p className="mb-5 text-muted">If you have a role that fits, I would like to hear about it.</p>
        <EmailButton />
      </footer>
    </div>
  );
}
