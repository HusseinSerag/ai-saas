import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const testimonals = [
  {
    name: "Hussein",
    avatar: "H",
    title: "Software Engineer",
    description: "Amazing tool for developers!",
  },
  {
    name: "Hussein",
    avatar: "H",
    title: "Software Engineer",
    description: "Amazing tool for developers!",
  },
  {
    name: "Hussein",
    avatar: "H",
    title: "Software Engineer",
    description: "Amazing tool for developers!",
  },
  {
    name: "Hussein",
    avatar: "H",
    title: "Software Engineer",
    description: "Amazing tool for developers!",
  },
];
export default function LandingContent() {
  return (
    <div className="px-10 pb-20">
      <h2 className="mb-10 text-center text-3xl font-extrabold text-white">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {testimonals.map((item) => (
          <Card
            key={item.description}
            className="border-none bg-[#192339] text-white"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-sm text-zinc-400">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className="px-0 pt-4">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
