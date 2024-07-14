import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { of, tap, map } from 'rxjs';

export interface Config {
    title: string;
    author: string;
    position: string;
    linkedin: string,
    git: string;
}

interface ConfigState {
    isLoaded: boolean;
    data: Config | null;
}

const initialState: ConfigState = {
    isLoaded: false,
    data: null,
};

@Injectable({ providedIn: 'root' })
export class ConfigService {
    private readonly state = new BehaviorSubject<ConfigState>(initialState);
    public readonly state$ = this.state.asObservable();
    public config: Config | null = null;

    constructor(private readonly http: HttpClient) { }

    public load(): Observable<Config> {
        return this.http.get<Config>('assets/config.json').pipe(
            tap((config) => {
                this.config = config;
                this.state.next({ isLoaded: true, data: config });
            })
        );
    }
}