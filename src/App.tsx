import Advice from './components/Advice';
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
import { sections } from './data/sections';

export default function App() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <Header />
      <main>
        <Block {...sections.work}>
          <div className="space-y-20">
            <Savings />
            <Project {...booking} room="backend" />
            <Project title={office.title} summary={office.summary} points={office.points} stack={office.stack} room="frontend">
              <OfficeView caption={office.caption} />
            </Project>
          </div>
        </Block>
        <Block {...sections.experience}>
          <Experience />
        </Block>
        <Block {...sections.other}>
          <SideProjects />
        </Block>
        <Block {...sections.skills}>
          <Skills />
        </Block>
        <Block {...sections.credentials}>
          <Credentials />
        </Block>
        <Block {...sections.advice}>
          <Advice />
        </Block>
      </main>
      <footer className="border-t border-rule py-12">
        <p className="mb-5 text-muted">If you have a role that fits, I would like to hear about it.</p>
        <EmailButton />
      </footer>
    </div>
  );
}
