import {Link} from '@remix-run/react';

interface ICollection {
  node: {
    id: string;
    title: string;
    image: {
      url: string;
    } | null;
  };
}

interface IProps {
  data: ICollection[];
}

export const Categories = ({data}: IProps) => {
  console.log('PROPS', data);

  return (
    <div className="w-full flex justify-center pt-10">
      <div className="w-full max-w-screen-xl flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 px-4 md:px-8">
        {data.map((item) => (
          <Link to="/" key={item.node.id}>
            {item.node.image ? (
              <img
                alt={item.node.title}
                src={item.node.image.url}
                className="transition hover:opacity-80"
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center border">
                No Image
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};
