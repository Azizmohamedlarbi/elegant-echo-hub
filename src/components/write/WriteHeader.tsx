
interface WriteHeaderProps {
  title: string;
  description: string;
}

export function WriteHeader({ title, description }: WriteHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}
