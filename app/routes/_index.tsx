import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'RouteScanner – Assessment' },
  ];
};

export default function Index() {
  return (
    <div className="p-20">
      <div className="prose prose-slate prose-sm dark:prose-invert">
        <h1>RouteScanner – Assessment</h1>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi dignissimos, enim excepturi harum labore maiores minima nam necessitatibus nemo neque non numquam officiis ratione, reiciendis rem repudiandae, sapiente tenetur ut.
        </p>
      </div>
    </div>
  );
}
