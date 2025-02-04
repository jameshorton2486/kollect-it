interface NotFoundProps {
  message?: string;
}

export function NotFound({ message = "Not found" }: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">404</h2>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}