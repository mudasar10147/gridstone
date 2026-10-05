import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardMedia } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { Image } from "@/components/ui/Image";
import { Text } from "@/components/ui/Text";
import { formatCompactNumber, formatPercent } from "@/utils/format";
import type { Game } from "../types";

// Image is 1/3 of the card; cards show 3 per view on xl, 2 on sm, 1 on phones.
const CARD_IMAGE_SIZES = "(min-width: 1280px) 8vw, (min-width: 640px) 16vw, 30vw";

export interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Card
      as="article"
      shape="angled"
      layout="split"
      interactive
      className="h-full"
    >
      <CardMedia>
        <Image
          layout="fill"
          src={game.image.src}
          alt={game.image.alt}
          sizes={CARD_IMAGE_SIZES}
        />
        {game.rank !== undefined && (
          <Badge
            variant="accent"
            icon="flame"
            className="absolute top-3 left-card-inset"
          >
            #{game.rank}
          </Badge>
        )}
      </CardMedia>

      <CardBody>
        <div className="flex flex-col gap-1">
          <Heading as="h3" size="card">
            {game.title}
          </Heading>
          <Text size="sm" tone="muted">
            {game.tags.join(" · ")}
          </Text>
        </div>

        <ul className="flex items-center divide-x divide-border-strong text-sm text-text-secondary">
          <li className="flex items-center gap-1.5 pr-3">
            <Icon name="thumbs-up" size="sm" />
            <span className="sr-only">Liked by</span>
            {formatPercent(game.likePercent)}
          </li>
          <li className="flex items-center gap-1.5 pl-3">
            <Icon name="user" size="sm" />
            {formatCompactNumber(game.activePlayers)}
            <span className="sr-only">players</span>
          </li>
        </ul>

        <div className="mt-auto flex items-center gap-1">
          <Button
            href={game.playUrl}
            size="sm"
            leadingIcon="play"
            fullWidth
          >
            Play now<span className="sr-only">: {game.title}</span>
          </Button>
          <IconButton
            href={game.detailsUrl}
            icon="external-link"
            label={`${game.title} on Roblox`}
          />
        </div>
      </CardBody>
    </Card>
  );
}
