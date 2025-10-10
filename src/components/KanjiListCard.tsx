import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Kanji } from './Lesson';
import { useState } from 'react';

type KanjiListCardProps = {
  kanjiList: Kanji[];
};

export default function KanjiListCard({ kanjiList }: KanjiListCardProps) {
  const [displayList, setDisplayList] = useState<boolean>(false);

  return (
    <>
      <ScrollArea
        className={`max-w-max rounded-md border ${displayList ? 'h-72' : 'h-auto'}`}
      >
        <div className="p-4">
          <button
            onClick={() => setDisplayList(!displayList)}
            className="mb-4 text-sm font-medium leading-none"
          >
            {!displayList ? 'View Kanji' : 'Hide Kanji'}
          </button>
          {displayList ? (
            <ul>
              {kanjiList.map((kanji, index) => (
                <li
                  key={`${kanji.character}-${index}`}
                  className="flex items-center space-y-2 md:space-y-0 text-xl"
                >
                  <HoverCard>
                    <HoverCardTrigger
                      asChild
                      className="flex items-center justify-center max-w-max"
                    >
                      <button className="hover:bg-gray-200 py-1 px-2 rounded-sm">
                        {kanji.character}
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-full">
                      <div className="flex justify-between space-x-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">
                            {kanji.character}
                          </h4>
                          {kanji.readings.map((reading, idx) => (
                            <li
                              className="list-none text-sm"
                              key={`${reading.value}-${idx}`}
                            >
                              {reading.value}
                            </li>
                          ))}
                          <div className="flex items-center pt-2">
                            <span className="text-xs text-muted-foreground">
                              {kanji.meaning}
                            </span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </li>
              ))}{' '}
            </ul>
          ) : (
            ''
          )}
        </div>
        <ScrollBar />
      </ScrollArea>
    </>
  );
}
