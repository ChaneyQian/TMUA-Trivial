import ExamApp from '@/components/exam/ExamApp';
import PixelCompanion from '@/components/companion/PixelCompanion';
import { LangProvider } from '@/lib/LangContext';

// 纯静态站点：题目数据在构建期生成，ExamApp 在浏览器里取索引和题目
export default function HomePage() {
  return (
    <LangProvider>
      <ExamApp />
      <PixelCompanion />
    </LangProvider>
  );
}
